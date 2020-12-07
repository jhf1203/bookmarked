const router = require("express").Router();

module.exports = (db) => {
  // Load profile page
  router.get("/profile", (req, res) => {
    if (req.isAuthenticated()) {
      Promise.all([db.User.findOne({
        where: {
          id: req.session.passport.user.id
        },
        raw: true,
        include: [db.List]
      }),
      db.List.findAll({
        where: {
          UserId: req.session.passport.user.id
        },
        raw: true
      }),
      db.Connection.findAll({
        raw: true
      }),
      db.Blog.findAll({
        where: {
          UserId: req.session.passport.user.id
        },
        raw: true
      }),
      db.Image.findOne({
        where: {
          UserId: req.session.passport.user.id
        },
        raw: true
      }),
      db.Rating.findAll({
        where: {
          BookId: req.session.passport.user.id
        },
        raw: true
      }),
      ]).then(data => {
        console.log("all of the data: ", data);
        console.log("YAYAYAYA", data[1]["Book.title"]);
        const followingUser = [];
        const userFollowing = [];
        const readPast = [];
        const readCurrent = [];
        const readFuture = [];
        const createdRaw = new Date(data[0].createdAt);
        const memberSince = createdRaw.toLocaleDateString();
        for (let i = 0; i < data[1].length; i++) {
          if (data[1][i].state === "past") {
            readPast.push(data[1][i]);
          } else if (data[1][i].state === "future") {
            readFuture.push(data[1][i]);
          } else {
            readCurrent.push(data[1][i]);
          }
        };
        db.User.findAll({
          raw: true
        }).then(allUsers => {
          allUsers.forEach(user => {
            data[2].forEach(fol => {
              if (fol.followerId === user.id && fol.followeeId === req.session.passport.user.id) {
                followingUser.push(user);
              } else if (fol.followeeId === user.id && fol.followerId === req.session.passport.user.id) {
                userFollowing.push(user);
              }
            });
          });
          const userToSend = {
            userInfo: data[0],
            userFollowing: userFollowing,
            followingUser: followingUser,
            pastList: readPast,
            currentList: readCurrent,
            futureList: readFuture,
            memberSince: memberSince,
            isloggedin: req.isAuthenticated(),
            userBlog: data[3]
          };
          console.log(userToSend);
          res.render("profile", userToSend);
        });
      });
    } else {
      res.redirect("/");
    }
  });

  // Load other user's pages
  router.get("/user/:id", (req, res) => {
    if (req.isAuthenticated()) {
      Promise.all([db.User.findOne({
        where: {
          id: req.params.id
        },
        raw: true,
        include: [db.List]
      }),
      db.List.findAll({
        where: {
          UserId: req.params.id
        },
        raw: true
      }),
      db.Connection.findAll({
        raw: true
      }),
      db.User.findOne({
        where: {
          id: req.session.passport.user.id
        },
        raw: true
      }),
      db.Blog.findAll({
        where: {
          UserId: req.params.id
        },
        raw: true
      }),
      db.Image.findOne({
        where: {
          UserId: req.params.id
        },
        raw: true
      }),
      db.Rating.findAll({
        where: {
          BookId: req.params.id
        },
        raw: true
      }),
      ]).then(data => {
        console.log("DATATADA ", data);
        const followingUser = [];
        const userFollowing = [];
        const readPast = [];
        const readCurrent = [];
        const readFuture = [];
        const createdRaw = new Date(data[0].createdAt);
        const memberSince = createdRaw.toLocaleDateString();
        for (let i = 0; i < data[1].length; i++) {
          if (data[1][i].state === "past") {
            readPast.push(data[1][i]);
          } else if (data[1][i].state === "future") {
            readFuture.push(data[1][i]);
          } else {
            readCurrent.push(data[1][i]);
          }
        };
        db.User.findAll({
          raw: true
        }).then(allUsers => {
          allUsers.forEach(user => {
            data[2].forEach(fol => {
              if (fol.followerId === user.id && fol.followeeId === req.params.id) {
                followingUser.push(user);
              } else if (fol.followeeId === user.id && fol.followerId === req.params.id) {
                userFollowing.push(user);
              }
            });
          });
          const userToSend = {
            userInfo: data[0],
            userFollowing: userFollowing,
            followingUser: followingUser,
            pastList: readPast,
            currentList: readCurrent,
            futureList: readFuture,
            memberSince: memberSince,
            isloggedin: req.isAuthenticated(),
            activeUser: data[3].id,
            userBlog: data[4]
          };
          console.log("USER TO SEND", userToSend);
          res.render("user", userToSend);
        });
      });
    } else {
      res.redirect("/");
    }
  });

  // Load login page
  router.get("/login", (req, res) => {
    res.render("login");
  });

  router.get("/login", (req, res) => {
    res.render("login");
  });
  // Load register page
  router.get("/register", (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect("/profile");
    } else {
      res.render("register");
    }
  });

  // Load dashboard page
  router.get("/", (req, res) => {
    if (req.isAuthenticated()) {
      const user = {
        user: req.session.passport.user,
        isloggedin: req.isAuthenticated()
      };
      res.render("dashboard", user);
    } else {
      res.render("dashboard");
    }
  });

  // Load dashboard page
  router.get("/dashboard", (req, res) => {
    if (req.isAuthenticated()) {
      const user = {
        user: req.session.passport.user,
        isloggedin: req.isAuthenticated()
      };
      res.render("dashboard", user);
    } else {
      res.render("dashboard");
    }
  });

  // Load View Books page
  router.get("/example", function (req, res) {
    if (req.isAuthenticated()) {
      db.User.findOne({
        where: {
          id: req.session.passport.user.id
        },
        raw: true
      }).then(function (dbExamples) {
        res.render("example", {
          userInfo: req.session.passport.user,
          isloggedin: req.isAuthenticated(),
          msg: "Welcome!",
          examples: dbExamples
        });
      });
    } else {
      res.redirect("/");
    }
  });

  // load blog
  router.get("/blog", function (req, res) {
    if (req.isAuthenticated()) {
      db.Blog.findAll({
        where: {
          UserId: req.session.passport.user.id
        },
        raw: true
      }).then(function (dbBlog) {
        console.log(dbBlog);
        res.render("blog", {
          userInfo: req.session.passport.user,
          isloggedin: req.isAuthenticated(),
          msg: "Welcome!",
          examples: dbBlog
        });
      });
    } else {
      res.redirect("/");
    }
  });

  // Logout
  router.get("/logout", (req, res, next) => {
    req.logout();
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid", {
        path: "/"
      });
      res.redirect("/");
    });
  });

  // Render 404 page for any unmatched routes
  router.get("*", function (req, res) {
    res.render("404");
  });

  return router;
};
