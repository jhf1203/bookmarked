const fs = require("fs");
const path = require("path");
const Image = require("../models/image");

const filePath = path.join("./", __dirname, "/resources/static/assets/uploads/");
const tmpPath = path.join("./", __dirname, "/resources/static/assets/tmp/");

const uploadFiles = (req, res) => {
  try {
    console.log("here is req.file", req.file);
    console.log("here is filepath plus req.file.filename", filePath + req.file.filename);

    if (req.file === undefined) {
      return res.send(`You must select a file.`);
    }

    Image.create({
      type: req.file.mimetype,
      name: req.file.originalname,
      data: fs.readFileSync(
        filePath + req.file.filename
      )
    }).then((image) => {
      fs.writeFileSync(
        tmpPath + image.name,
        image.data
      );

      return res.send(`File has been uploaded.`);
    });
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload images: ${error}`);
  }
};

module.exports = {
  uploadFiles
};
