function UserController(service) {
  this.service = service;
  this.createUser = this.createUser.bind(this);
  this.getUser = this.getUser.bind(this);
  this.getAllUsers = this.getAllUsers.bind(this);
}

UserController.prototype.createUser = async function createUser(req, res) {
  let response = await this.service.createUser(req.params);
  console.log(response);
  res.status(response.statusCode).send(response);
};

UserController.prototype.getUser = async function getUser(req, res) {
  let response = await this.service.getUser(req.params);
  console.log(response);
  res.status(response.statusCode).send(response);
};

UserController.prototype.getAllUsers = async function getAllUsers(req, res) {
  let response = await this.service.getAllUsers(req.query);
  console.log(response);
  res.status(response.statusCode).send(response);
};

module.exports = UserController;
