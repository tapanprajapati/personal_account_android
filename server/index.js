const server = require("./config/server");

/**
 * Starting server
 */
const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
