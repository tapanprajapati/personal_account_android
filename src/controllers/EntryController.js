const fs = require("fs");
const path = require("path");

function EntryController(service) {
  this.service = service;
  this.getEntries = this.getEntries.bind(this);
  this.getRecentEntries = this.getRecentEntries.bind(this);
  this.createEntry = this.createEntry.bind(this);
  this.updateEntry = this.updateEntry.bind(this);
  this.deleteEntry = this.deleteEntry.bind(this);
  this.saveImage = this.saveImage.bind(this);
}

EntryController.prototype.getEntries = async function getEntries(req, res) {
  let response = await this.service.getEntries(req.query);
  console.log(response);
  res.status(response.statusCode).send(response);
};

EntryController.prototype.getRecentEntries = async function getRecentEntries(
  req,
  res
) {
  let response = await this.service.getRecentEntries(req.query);
  console.log(response);
  res.status(response.statusCode).send(response);
};

EntryController.prototype.createEntry = async function createEntry(req, res) {
  let response = await this.service.createEntry(req.body);
  console.log(response);
  res.status(response.statusCode).send(response);
};

EntryController.prototype.deleteEntry = async function deleteEntry(req, res) {
  let response = await this.service.deleteEntry(req.params);
  console.log(response);
  res.status(response.statusCode).send(response);
};

EntryController.prototype.updateEntry = async function updateEntry(req, res) {
  let response = await this.service.updateEntry(req.body);
  console.log(response);
  res.status(response.statusCode).send(response);
};

EntryController.prototype.saveImage = async function saveImage(req, res) {
  let response = await this.service.saveImage(req);
  console.log(response);
  res.status(response.statusCode).send(response);
};

EntryController.prototype.retrieveImage = async function retrieveImage(
  req,
  res
) {
  const id = req.query.id;

  const options = {
    root: path.join(__dirname + "../../../images"),
  };
  if (fs.existsSync(`./images/${id}.jpg`)) {
    res.sendFile(`${id}.jpg`, options, (error) => {
      if (error) {
        console.log("Error sending file");
      }
    });
  } else {
    res.status(400).send({
      success: false,
      statusCode: 400,
      message: "image not available",
    });
  }
};

EntryController.prototype.checkImageExists = async function checkImageExists(
  req,
  res
) {
  const id = req.query.id;

  if (fs.existsSync(`./images/${id}.jpg`)) {
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "image exists",
    });
  } else {
    res.status(400).send({
      success: false,
      statusCode: 400,
      message: "image not available",
    });
  }
};

EntryController.prototype.deleteImage = async function deleteImage(req, res) {
  const id = req.query.id;
  const imagePath = `./images/${id}.jpg`;
  if (fs.existsSync(imagePath)) {
    fs.rm(imagePath, (error) => {
      if (error) {
        res.status(400).send({
          success: false,
          statusCode: 400,
          message: "error deleting image",
        });
      } else {
        res.status(200).send({
          success: true,
          statusCode: 200,
          message: "image deleted",
        });
      }
    });
  } else {
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "image not available",
    });
  }
};

module.exports = EntryController;
