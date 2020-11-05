const router = require("express").Router();
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
// const homeController = require("../controllers/home");
const uploadController = require("../controllers/upload");
const upload = require("../middlewares/upload");

module.exports = (passport, db) => {
  const AuthController = require("../controllers/authController")(passport, db);
  const AppController = require("../controllers/appController")(db);

  // Authentication (provided)
  router.post("/register", AuthController.register);
  router.post("/login", AuthController.login);
  router.get("/logout", AuthController.logout);
  router.put("/user/:id", ensureAuthenticated, AuthController.updateUser);
  router.delete("/user/:id", ensureAuthenticated, AuthController.deleteUser);
  router.post("/user/confirm", AuthController.confirmAuth);

  // Project GET routes
  router.get("/books", AppController.getBookInfoInternal);
  router.get("/userInfo/:id", AppController.getUserInfo);
  router.get("/lists/:id", AppController.getUserList);
  router.get("/connections/", AppController.getUserConnections);
  router.get("/blog/:id", AppController.getUserBlog);

  // Project POST routes
  router.post("/books", AppController.addBookInternal);
  router.post("/connections", AppController.followUser);
  router.post("/lists", AppController.addToList);
  router.post("/upload", upload.single("file"), uploadController.uploadFiles);
  router.post("/blog", AppController.addBlogPost);

  // Project DELETE routes
  router.delete("/connections", AppController.unFollow);
  router.delete("/lists/:id", AppController.deleteFromList);
  router.delete("/blog/:id", AppController.deleteBlogPost);
  return router;
};
