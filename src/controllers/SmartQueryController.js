function SmartQueryController(service) {
  this.service = service;
  this.getData = this.getData.bind(this);
}

SmartQueryController.prototype.getData = async function getData(req, res) {
  let response = await this.service.getData(req.body);
  console.log(response);
  res.status(response.statusCode).send(response);
};

module.exports = SmartQueryController;
