// Requiring our models and passport as we've configured it
var db = require("../models");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error

  app.post("/api/signupBusi", function(req, res) {
    db.businessPG
      .create({
        businessName: req.body.businessName,
        menu: req.body.menu,
        location: req.body.location
      })
      .then(function(dbbusinessPG) {
        res.json(dbbusinessPG);
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });
  // Route for getting some data about our user to be used client side
  app.get("/api/business_data", function(req, res) {
    if (!req.businessPG) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        businessName: req.businessPG.businessName,
        location: req.businessPG.location,
        menu: req.businessPG.menu,
        id: req.businessPG.id
      });
    }
  });
};