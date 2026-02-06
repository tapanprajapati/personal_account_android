const OpenAI = require("openai");

function OpenAIClient(apiKey, model) {
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required");
  }
  this.client = new OpenAI({ apiKey });
  this.model = model || "gpt-4o-mini";
}

OpenAIClient.prototype.generateSql = async function generateSql(prompt) {
  const response = await this.client.chat.completions.create({
    model: this.model,
    temperature: 0,
    messages: [
      { role: "system", content: prompt.system },
      { role: "user", content: prompt.user },
    ],
  });

  const content =
    response &&
    response.choices &&
    response.choices[0] &&
    response.choices[0].message &&
    response.choices[0].message.content
      ? response.choices[0].message.content
      : "";

  return content;
};

module.exports = OpenAIClient;
