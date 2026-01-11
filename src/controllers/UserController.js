function UserController(service) {
  this.service = service;
  this.createUser = this.createUser.bind(this);
  this.loginUser = this.loginUser.bind(this);
  this.getAllUsers = this.getAllUsers.bind(this);
}

UserController.prototype.createUser = async function createUser(req, res) {
  let response = await this.service.createUser(req.params);
  console.log(response);
  res.status(response.statusCode).send(response);
};

UserController.prototype.loginUser = async function loginUser(req, res) {
  let response = await this.service.loginUser(req.body);
  console.log(response);
  res.status(response.statusCode).send(response);
};

UserController.prototype.getAllUsers = async function getAllUsers(req, res) {
  let response = await this.service.getAllUsers(req.query);
  console.log(response);
  res.status(response.statusCode).send(response);
};

module.exports = UserController;
