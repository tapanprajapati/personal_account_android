function CategoryController(service) {
  this.service = service;
  this.getCategories = this.getCategories.bind(this);
  this.createCategory = this.createCategory.bind(this);
  this.updateCategory = this.updateCategory.bind(this);
  this.transferCategory = this.transferCategory.bind(this);
  this.deleteCategory = this.deleteCategory.bind(this);
  this.exists = this.exists.bind(this);
}

CategoryController.prototype.getCategories = async function getCategories(
  req,
  res
) {
  let response = await this.service.getCategories(req.params, req.query);
  console.log(response);
  res.status(response.statusCode).send(response);
};

CategoryController.prototype.createCategory = async function createCategory(
  req,
  res
) {
  let response = await this.service.createCategory(req.body);
  console.log(response);
  res.status(response.statusCode).send(response);
};

CategoryController.prototype.deleteCategory = async function deleteCategory(
  req,
  res
) {
  let response = await this.service.deleteCategory(req.params);
  console.log(response);
  res.status(response.statusCode).send(response);
};

CategoryController.prototype.updateCategory = async function updateCategory(
  req,
  res
) {
  let response = await this.service.updateCategory(req.params, req.query);
  console.log(response);
  res.status(response.statusCode).send(response);
};

CategoryController.prototype.transferCategory = async function transferCategory(
  req,
  res
) {
  let response = await this.service.transferCategory(req.params, req.query);
  console.log(response);
  res.status(response.statusCode).send(response);
};

CategoryController.prototype.exists = async function exists(req, res) {
  let response = await this.service.exists(req.query);
  console.log(response);
  res.status(response.statusCode).send(response);
};

module.exports = CategoryController;
