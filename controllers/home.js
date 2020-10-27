const path = require("path");

const home = (req, res) => {
  return res.sendFile(path.join(`${__dirname}../public/assets/html/newProfile.html`));
};

module.exports = {
  getHome: home
};
