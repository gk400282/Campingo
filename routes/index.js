var express = require("express");
var router  = express.Router();
var passport = require("passport");
var user    = require("../models/user");
var bodyparser = require("body-parser");

router.use(bodyparser.urlencoded({extended:true}));

//==========
//Common Routes
//==========
router.get("/", function(req, res){
    res.render("landing");
});
//===========
//Auth routes
//===========
router.get("/register", function(req, res){
    console.log(req.body);
    res.render("authentications/register");
});
router.post("/register", function(req, res){
    var newUser = new user({username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email});
    user.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            console.log(user);
            req.flash("success", `Welcome to Campingo ${user.firstname}`);
            res.redirect("/campgrounds");
        });
    });
});
router.get("/login", function(req, res){
    res.render("authentications/login");
});
router.post("/login", passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
});
router.get("/logout", function(req, res, next){
    req.logout(function(err) {
        if (err) { 
            console.log(err);
            return next(err); 
        }
      });
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

// =========
// middleware
// =========
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;