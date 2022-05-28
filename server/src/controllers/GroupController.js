function GroupController(service) {
  this.service = service;
  this.getGroups = this.getGroups.bind(this);
  this.createGroup = this.createGroup.bind(this);
  this.joinGroup = this.joinGroup.bind(this);
  this.leaveGroup = this.leaveGroup.bind(this);
}

GroupController.prototype.getGroups = async function getGroups(req, res) {
  let response = await this.service.getGroups(req.params);
  console.log(response);
  res.status(response.statusCode).send(response);
};

GroupController.prototype.createGroup = async function createGroup(req, res) {
  let response = await this.service.createGroup(req.body);
  console.log(response);
  res.status(response.statusCode).send(response);
};

GroupController.prototype.joinGroup = async function joinGroup(req, res) {
  let response = await this.service.joinGroup(req.body);
  console.log(response);
  res.status(response.statusCode).send(response);
};

GroupController.prototype.leaveGroup = async function leaveGroup(req, res) {
  let response = await this.service.leaveGroup(req.body);
  console.log(response);
  res.status(response.statusCode).send(response);
};

module.exports = GroupController;
