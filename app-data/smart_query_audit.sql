CREATE TABLE IF NOT EXISTS smart_query_audit (
  id INT AUTO_INCREMENT PRIMARY KEY,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  input_text TEXT NOT NULL,
  sql_text TEXT NOT NULL,
  params_json TEXT,
  dry_run TINYINT(1) NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL,
  error_message TEXT,
  rows_affected INT
);
