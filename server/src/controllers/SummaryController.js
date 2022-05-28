function SummaryController(service) {
  this.service = service;
  this.getYearTotal = this.getYearTotal.bind(this);
  this.getYearTotalAllCategories = this.getYearTotalAllCategories.bind(this);
  this.getMonthTotal = this.getMonthTotal.bind(this);
  this.getMonthTotalAllCategories = this.getMonthTotalAllCategories.bind(this);
  this.getDateTotal = this.getDateTotal.bind(this);
  this.getYears = this.getYears.bind(this);
  this.getAllYears = this.getAllYears.bind(this);
  this.getMonths = this.getMonths.bind(this);
  this.getAllMonths = this.getAllMonths.bind(this);
  this.getDates = this.getDates.bind(this);
  this.getTypeTotal = this.getTypeTotal.bind(this);
  this.getAllCategoriesTotal = this.getAllCategoriesTotal.bind(this);
  this.getAllCategoriesTotalMonth = this.getAllCategoriesTotalMonth.bind(this);
  this.getAllCategoriesTotalYear = this.getAllCategoriesTotalYear.bind(this);
}

SummaryController.prototype.getYearTotal = async function getYearTotal(
  req,
  res
) {
  let response = await this.service.getYearTotal(req.query);
  console.log(response);
  res.status(response.statusCode).send(response);
};

SummaryController.prototype.getYearTotalAllCategories =
  async function getYearTotalAllCategories(req, res) {
    let response = await this.service.getYearTotalAllCategories(req.query);
    console.log(response);
    res.status(response.statusCode).send(response);
  };

SummaryController.prototype.getMonthTotal = async function getMonthTotal(
  req,
  res
) {
  let response = await this.service.getMonthTotal(req.query);
  console.log(response);
  res.status(response.statusCode).send(response);
};

SummaryController.prototype.getMonthTotalAllCategories =
  async function getMonthTotalAllCategories(req, res) {
    let response = await this.service.getMonthTotalAllCategories(req.query);
    console.log(response);
    res.status(response.statusCode).send(response);
  };

SummaryController.prototype.getDateTotal = async function getDateTotal(
  req,
  res
) {
  let response = await this.service.getDateTotal(req.query);
  console.log(response);
  res.status(response.statusCode).send(response);
};

SummaryController.prototype.getYears = async function getYears(req, res) {
  let response = await this.service.getYears(req.query);
  console.log(response);
  res.status(response.statusCode).send(response);
};

SummaryController.prototype.getAllYears = async function getAllYears(req, res) {
  let response = await this.service.getAllYears(req.query);
  console.log(response);
  res.status(response.statusCode).send(response);
};

SummaryController.prototype.getMonths = async function getMonths(req, res) {
  let response = await this.service.getMonths(req.query);
  console.log(response);
  res.status(response.statusCode).send(response);
};

SummaryController.prototype.getAllMonths = async function getAllMonths(
  req,
  res
) {
  let response = await this.service.getAllMonths(req.query);
  console.log(response);
  res.status(response.statusCode).send(response);
};

SummaryController.prototype.getDates = async function getDates(req, res) {
  let response = await this.service.getDates(req.query);
  console.log(response);
  res.status(response.statusCode).send(response);
};

SummaryController.prototype.getTypeTotal = async function getTypeTotal(
  req,
  res
) {
  let response = await this.service.getTypeTotal(req.params, req.query);
  console.log(response);
  res.status(response.statusCode).send(response);
};

SummaryController.prototype.getAllCategoriesTotal =
  async function getAllCategoriesTotal(req, res) {
    let response = await this.service.getAllCategoriesTotal(
      req.params,
      req.query
    );
    console.log(response);
    res.status(response.statusCode).send(response);
  };

SummaryController.prototype.getAllCategoriesTotalMonth =
  async function getAllCategoriesTotalMonth(req, res) {
    let response = await this.service.getAllCategoriesTotalMonth(
      req.params,
      req.query
    );
    console.log(response);
    res.status(response.statusCode).send(response);
  };

SummaryController.prototype.getAllCategoriesTotalYear =
  async function getAllCategoriesTotalYear(req, res) {
    let response = await this.service.getAllCategoriesTotalYear(
      req.params,
      req.query
    );
    console.log(response);
    res.status(response.statusCode).send(response);
  };

module.exports = SummaryController;
