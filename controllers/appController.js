// const convert = require('xml-js');

module.exports = function (db) {
  return {
    // Get all examples
    getExamples: function (req, res) {
      db.Example.findAll({ where: { UserId: req.session.passport.user.id } }).then(function (dbExamples) {
        res.json(dbExamples);
      });
    },
    // Create a new example
    createExample: function (req, res) {
      db.Example.create(req.body).then(function (dbExample) {
        res.json(dbExample);
      });
    },
    // Delete an example by id
    deleteExample: function (req, res) {
      db.Example.destroy({ where: { id: req.params.id } }).then(function (dbExample) {
        res.json(dbExample);
      });
    },

    // ========= GET ROUTES =========
    getUserInfo: function (req, res) {
      db.User.findOne({
        where: {
          id: req.params.id
        },
        include: [db.List]
      }).then(data => {
        res.json(data);
      }).catch(error => {
        console.log(error);
      });
    },
    getBookInfoInternal: function (req, res) {
      db.Book.findAll({}).then(data => {
        res.json(data);
      }).catch(error => {
        console.log(error);
      });
    },

    getOneBook: function (req, res) {
      db.Book.findOne({
        where: {
          id: req.params.id
        }
      }).then(data => {
        res.json(data);
        console.log("data from getone", data);
      });
    },

    getUserList: function (req, res) {
      db.List.findOne({
        where: {
          id: req.params.id
        },
        include: [db.Book]
      }).then(data => {
        res.json(data);
      }).catch(error => {
        console.log(error);
      });
    },

    // getBookReviewsByUser: function (req, res) {
    //   db.Review.findAll({
    //     where: {
    //       UserId: req.params.id
    //     },
    //     include: [db.Book]
    //   }).then(data => {
    //     res.json(data);
    //   }).catch(error => {
    //     console.log(error);
    //   });
    // },
    // getBookReviewsByBook: function (req, res) {
    //   db.Review.findAll({
    //     where: {
    //       BookIsbn: req.params.id
    //     },
    //     include: [db.User]
    //   }).then(data => {
    //     res.json(data);
    //   }).catch(error => {
    //     console.log(error);
    //   });
    // },
    // getFollowers: function (req, res) {
    //   db.Connection.findAll({
    //     where: {
    //       followeeID: req.params.followeeID
    //     }
    //   }).then(data => {
    //     res.json(data);
    //   }).catch(error => {
    //     console.log(error);
    //   });
    // },
    // getFollowing: function (req, res) {
    //   db.Connection.findAll({
    //     where: {
    //       followerID: req.params.followerID
    //     }
    //   }).then(data => {
    //     res.json(data);
    //   }).catch(error => {
    //     console.log(error);
    //   });
    // },
    getUserConnections: function (req, res) {
      db.Connection.findAll({
      }).then(data => {
        res.json(data);
      }).catch(error => {
        console.log(error);
      });
    },

    getUserBlog: function (req, res) {
      db.Blog.findAll({
        where: {
          UserId: req.params.id
        }
      }).then(data => {
        res.json(data);
      }).catch(error => {
        console.log(error);
      });
    },

    // getUserImage: function (req, res) {
    //   db.Image.findOne({
    //     where: {
    //       UserId: req.params.id
    //     }
    //   }).then(data => {
    //     res.json(data);
    //   }).catch(error => {
    //     console.log(error);
    //   });
    // },

    // ========= POST ROUTES ========

    // updateUserTable: function (req, res) {
    //   db.User.create(req.body).then(function (dbUsers) {
    //     res.json(dbUser);
    //   });
    // },
    addBookInternal: function (req, res) {
      db.Book.create(req.body).then(function (dbBook) {
        res.json(dbBook);
      });
    },

    followUser: function (req, res) {
      db.Connection.create(req.body).then(function (dbConnection) {
        res.json(dbConnection);
      });
    },

    // addToFuture: function (req, res) {
    //   db.readFuture.create(req.body).then(function (dbAddToFuture) {
    //     res.json(dbAddToFuture);
    //   });
    // },

    addToList: function (req, res) {
      db.List.create(req.body).then(function (dbAddToList) {
        res.json(dbAddToList);
      });
    },

    addBlogPost: function (req, res) {
      console.log(req.body);
      db.Blog.create({
        heading: req.body.heading,
        blurb: req.body.blurb,
        UserId: req.body.UserId
      }).then(function (blogData) {
        res.json(blogData);
        console.log("res", res);
        console.log("blogdata", blogData);
      });
    },
    // addToCurrent: function (req, res) {
    //   db.readCurrent.create(req.body).then(function (dbAddToCurrent) {
    //     res.json(dbAddToCurrent);
    //   });
    // },

    // addToPast: function (req, res) {
    //   db.readPast.create(req.body).then(function (dbAddToPast) {
    //     res.json(dbAddToPast);
    //   });
    // },

    // addReview: function (req, res) {
    //   db.Review.create(req.body).then(function (dbAddReview) {
    //     res.json(dbAddReview);
    //   });
    // },

    // ========= DELETE ROUTES =========
    unFollow: function (req, res) {
      db.Connection.destroy({ where:
        { followerID: req.params.followerID,
          followeeID: req.params.followeeID }
      }).then(function (dbConnection) {
        res.json(dbConnection);
      });
    },
    deleteFromList: function (req, res) {
      db.List.destroy({ where: { id: req.params.id }
      }).then(function (dbList) {
        res.json(dbList);
      });
    },

    deleteBlogPost: function (req, res) {
      db.Blog.destroy({
        where: {
          id: req.params.id
        }
      }).then(function (dbList) {
        res.json(dbList);
      });
    },

    updateImage: function (req, res) {
      db.Image.create(req.body).then(function (dbImage) {
        res.json(dbImage);
      });
    }
    // deleteExample: function (req, res) {
    //   db.Example.destroy({ where: { id: req.params.id } }).then(function (dbExample) {
    //     res.json(dbExample);
    //   });
    // },

  };
};
