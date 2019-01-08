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
    res.redirect("/campgrounds");
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
            return res.render("authentications/register");
        }
        passport.authenticate("local")(req, res, function(){
            console.log(user);
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
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});
//=========
//middleware
//=========
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;