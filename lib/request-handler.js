var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

var environment = process.env.PORT ? "production" : "development";

exports.renderIndex = function(req, res) {
  console.log("Process PORT - render Index:", process.env.PORT);
  console.log("Environment:", environment);
  res.render('index', {environment: environment});
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, function (err, links) {
    if (err) {
      console.log("Error");
    }
    // console.log("Fetch links:", links);
    console.log("Process PORT - fetch links:", process.env.PORT);
    console.log("Environment:", environment);
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.find({ url: uri }, function (err, link) {
    if (link.length > 0) {
      res.send(200, link);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        link.initialize();

        link.save(function(err) {
          if (err) {
            console.log("Error");
          }
          res.send(200, link);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function (err, user) {
    if (!user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user.username);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function (err, user) {
    if (!user) {
      var newUser = new User({
        username: username,
        password: password
      });

      newUser.hashPassword().then(function () {
        newUser.save(function (err) {
          if (err) {
            console.log("Error in Signup");
          }
          util.createSession(req, res, newUser.username);
        });
      });

    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }, function (err, link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.visits = link.visits + 1;
      link.save(function (err) {
        if (err){
          console.log("Error");
        }
        return res.redirect(link.url);
      });
    }
  });
};