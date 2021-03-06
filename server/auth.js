const router = require("express").Router();
const { User } = require("./db");
module.exports = router;

const userNotFound = next => {
  const err = new Error("Not found");
  err.status = 404;
  next(err);
};

router.get("/me", (req, res, next) => {
  if (!req.user) {
    userNotFound(next);
  } else {
    User.findById(req.user.id)
      .then(user => (user ? res.json(user) : userNotFound(next)))
      .catch(next);
  }
});

router.put("/login", (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email,
      password: req.body.password
    }
  })
    .then(user => {
      if (user) {
        req.login(user, function(err) {
          if (err) {
            return next(err);
          }
          res.json(user);
        });
      } else {
        const err = new Error("Incorrect email or password!");
        err.status = 401;
        next(err);
      }
    })
    .catch(next);
});

router.use("/google", require("./oauth"))

router.use('/twitter', require('./oauth2'))

router.delete("/logout", (req, res, next) => {
  req.session.destroy();
  req.logout();
  res.status(204).end();
});
