function RecurringController(service) {
  this.service = service;
  this.getRecurrings = this.getRecurrings.bind(this);
  this.createRecurring = this.createRecurring.bind(this);
  this.updateRecurring = this.updateRecurring.bind(this);
  this.deleteRecurring = this.deleteRecurring.bind(this);
}

RecurringController.prototype.getRecurrings = async function getRecurrings(
  req,
  res
) {
  let response = await this.service.getRecurrings(req.params, req.query);
  console.log(response);
  res.status(response.statusCode).send(response);
};

RecurringController.prototype.createRecurring = async function createRecurring(
  req,
  res
) {
  let response = await this.service.createRecurring(req.body);
  console.log(response);
  res.status(response.statusCode).send(response);
};

RecurringController.prototype.deleteRecurring = async function deleteRecurring(
  req,
  res
) {
  let response = await this.service.deleteRecurring(req.params);
  console.log(response);
  res.status(response.statusCode).send(response);
};

RecurringController.prototype.updateRecurring = async function updateRecurring(
  req,
  res
) {
  let response = await this.service.updateRecurring(req.body);
  console.log(response);
  res.status(response.statusCode).send(response);
};

module.exports = RecurringController;
