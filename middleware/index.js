var campground = require("../models/campground");
var comment = require('../models/comment');

//all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwernership = function(req, res, next){
    if(req.isAuthenticated()){
        campground.findOne({_id: req.params.id}, function(err, foundCampground){
            if(err || !foundCampground){
                req.flash("error", "Campground not found!");
                res.redirect("/campgrounds");
            }
            else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect(`/campgrounds/${foundCampground._id}`);
                }
            }
        }); 
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
       comment.findOne({_id: req.params.comment_id}, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found!")
                res.redirect("/campgrounds");
            }
            else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("/campgrounds");
                }
            }
        }); 
    }else{
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
}

module.exports = middlewareObj;