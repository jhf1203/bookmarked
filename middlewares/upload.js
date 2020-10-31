// import multer
const multer = require("multer");

// only allows images to pass
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    return cb(null, true);
  } else {
    // eslint-disable-next-line standard/no-callback-literal
    return cb("Please upload only images.", false);
  }
};

/* configure to use disk storage engine */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // eslint-disable-next-line no-undef
    cb(null, __basedir + "/resources/static/assets/uploads/");
  }, // picks where the uploads will go
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-bookmarked-${file.originalname}`);
  } // this line makes sure duplicates don't occur
});

const uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;
