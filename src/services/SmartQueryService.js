const mysql = require("mysql");
const DatabaseFactory = require("../../config/databaseFactory");
const dbConfig = require("../../app-data/dbConfig");
const queries = require("../../app-data/queries");
const OpenAIClient = require("./OpenAIClient");

const database = DatabaseFactory.getInstance();

const SCHEMA_TTL_MS = 10 * 60 * 1000;
let schemaCache = null;
let schemaCacheAt = 0;

function SmartQueryService() {
  const apiKey = process.env.OPENAI_API_KEY;
  this.openaiClient = apiKey
    ? new OpenAIClient(apiKey, process.env.OPENAI_MODEL)
    : null;
}

SmartQueryService.prototype.getData = async function getData(body) {
  const inputText = body && body.query ? body.query.trim() : "";
  const dryRun = body && body.dryRun ? true : false;

  if (!inputText) {
    return {
      success: false,
      statusCode: 400,
      message: "Query is required",
    };
  }
  if (!this.openaiClient) {
    return {
      success: false,
      statusCode: 500,
      message: "OpenAI API key is not configured",
    };
  }

  let sqlText = "";
  let params = [];
  let result = null;
  let rowsAffected = null;

  try {
    const schemaText = await this.getSchemaContext();
    const prompt = this.buildPrompt(inputText, schemaText);
    const llmOutput = await this.openaiClient.generateSql(prompt);
    const parsed = this.parseModelOutput(llmOutput);

    sqlText = parsed.sql;
    params = parsed.params;

    if (this.hasMultipleStatements(sqlText)) {
      throw new Error("Multiple statements are not allowed");
    }

    if (dryRun) {
      await this.logAudit({
        inputText,
        sqlText,
        params,
        dryRun,
        status: "dry_run",
        errorMessage: null,
        rowsAffected: null,
      });

      return {
        success: true,
        statusCode: 200,
        data: {
          headers: [],
          rows: [],
        },
        sql: sqlText,
        params,
        message: "dry run",
      };
    }

    if (this.isSelectQuery(sqlText)) {
      const response = await database.queryWithFields(sqlText, params);
      const headers = Array.isArray(response.fields)
        ? response.fields.map((f) => f.name)
        : [];
      const rows = Array.isArray(response.rows) ? response.rows : [];
      result = { headers, rows };
      rowsAffected = Array.isArray(rows) ? rows.length : null;
    } else {
      const execResult = await database.query(sqlText, params);
      result = execResult;
      rowsAffected =
        execResult && typeof execResult.affectedRows === "number"
          ? execResult.affectedRows
          : null;
    }

    await this.logAudit({
      inputText,
      sqlText,
      params,
      dryRun,
      status: "success",
      errorMessage: null,
      rowsAffected,
    });

    return {
      success: true,
      statusCode: 200,
      data: this.isSelectQuery(sqlText)
        ? result
        : {
            headers: [],
            rows: result,
          },
    };
  } catch (error) {
    await this.logAudit({
      inputText,
      sqlText,
      params,
      dryRun,
      status: "error",
      errorMessage: error && error.message ? error.message : "Unknown error",
      rowsAffected,
    });

    return {
      success: false,
      statusCode: 500,
      message: "Unexpected error. Please try again after sometime.",
      error,
    };
  }
};

SmartQueryService.prototype.getSchemaContext = async function getSchemaContext() {
  const now = Date.now();
  if (schemaCache && now - schemaCacheAt < SCHEMA_TTL_MS) {
    return schemaCache;
  }

  try {
    const getSchema =
      "SELECT TABLE_NAME as tableName, COLUMN_NAME as columnName, DATA_TYPE as dataType " +
      "FROM information_schema.columns WHERE table_schema = ? " +
      "ORDER BY TABLE_NAME, ORDINAL_POSITION";
    const rows = await database.query(getSchema, [dbConfig.database]);
    const grouped = rows.reduce((acc, row) => {
      if (!acc[row.tableName]) acc[row.tableName] = [];
      acc[row.tableName].push(`${row.columnName} (${row.dataType})`);
      return acc;
    }, {});

    const schemaLines = Object.keys(grouped)
      .sort()
      .map((table) => `${table}: ${grouped[table].join(", ")}`);

    schemaCache = schemaLines.join("\n");
    schemaCacheAt = now;
    return schemaCache;
  } catch (error) {
    const fallbackTables = [
      "users",
      "groups",
      "usergroupmap",
      "categories",
      "entries",
      "recurring",
      "summary",
    ];
    schemaCache = `Schema unavailable. Known tables: ${fallbackTables.join(
      ", "
    )}`;
    schemaCacheAt = now;
    return schemaCache;
  }
};

SmartQueryService.prototype.buildPrompt = function buildPrompt(
  inputText,
  schemaText
) {
  return {
    system:
      "You are a MySQL expert. Return ONLY valid JSON. " +
      "Output schema: {\"sql\": string, \"params\": array, \"operation\": string, \"notes\": string}. " +
      "Use ? placeholders and put all values into params. " +
      "Generate exactly ONE SQL statement. Do not include multiple statements. " +
      "Never include markdown or code fences.",
    user:
      `User request: "${inputText}"\n` +
      "Database schema:\n" +
      `${schemaText}\n` +
      "Rules:\n" +
      "- Use MySQL syntax.\n" +
      "- If you must create or update data, ensure the statement is explicit and safe.\n" +
      "- Use LIMIT for potentially large selects when reasonable.",
  };
};

SmartQueryService.prototype.parseModelOutput = function parseModelOutput(
  llmOutput
) {
  const cleaned = this.stripFences(llmOutput || "").trim();
  let parsed = null;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error("Model returned invalid JSON");
  }

  if (!parsed || typeof parsed.sql !== "string" || !Array.isArray(parsed.params)) {
    throw new Error("Model response missing required fields");
  }

  return parsed;
};

SmartQueryService.prototype.stripFences = function stripFences(text) {
  if (!text) return "";
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed.replace(/```[a-zA-Z]*\n?/g, "").replace(/```$/g, "");
  }
  return trimmed;
};

SmartQueryService.prototype.hasMultipleStatements = function hasMultipleStatements(
  sqlText
) {
  const trimmed = (sqlText || "").trim();
  const matches = trimmed.match(/;/g) || [];
  if (matches.length === 0) return false;
  if (matches.length === 1 && trimmed.endsWith(";")) return false;
  return true;
};

SmartQueryService.prototype.isSelectQuery = function isSelectQuery(sqlText) {
  const trimmed = (sqlText || "").trim().toLowerCase();
  return (
    trimmed.startsWith("select") ||
    trimmed.startsWith("show") ||
    trimmed.startsWith("describe") ||
    trimmed.startsWith("explain")
  );
};

SmartQueryService.prototype.logAudit = async function logAudit(payload) {
  try {
    const insert = mysql.format(queries.smartQuery.insertAudit, [
      payload.inputText,
      payload.sqlText || "",
      JSON.stringify(payload.params || []),
      payload.dryRun ? 1 : 0,
      payload.status,
      payload.errorMessage,
      payload.rowsAffected,
    ]);
    await database.query(insert);
  } catch (error) {
    console.log("Failed to write smart_query_audit", error);
  }
};

module.exports = SmartQueryService;
