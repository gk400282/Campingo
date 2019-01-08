var express = require("express");
var router  = express.Router({mergeParams: true});
var campground = require("../models/campground");
var comment = require("../models/comment");
var bodyparser = require("body-parser");

router.use(bodyparser.urlencoded({extended:true}));
//============
//Comments routes
//============

router.get("/new", isLoggedIn, function(req, res){
    campground.findById(req.params.id, function( err, foundCampground){
        if(err){
            console.log("Comments form rendering route error"+err);
        }
        else{
            res.render("comments/addComments", { campground: foundCampground});
        }
    });
});
router.post("/", isLoggedIn, function(req, res){
    campground.findById(req.params.id).populate("comments").exec(function( err, thisCampground){
        if(err){
            console.log("Comments form rendering route error"+err);
            res.redirect("/campgrounds");
        }
        else{
            comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.firstname = req.user.firstname;
                    comment.author.lastname = req.user.lastname;
                    comment.save();
                    thisCampground.comments.push(comment);
                    thisCampground.save();
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });
        }
    });
});
router.get("/:comment_id/edit", isPermitted, function(req, res){
    campground.findOne({_id: req.params.id}, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            comment.findOne({_id: req.params.comment_id}, function(err, foundComment){
                if(err){
                    console.log(err);
                }else{
                    res.render("comments/edit", {campground: foundCampground, comment: foundComment});
                }
            });
        }
    });
});
router.put("/:comment_id", isPermitted, function(req, res){
    campground.findOne({_id: req.params.id}, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            comment.findOneAndUpdate({_id: req.params.comment_id}, req.body.comment, function(err, updatedComment){
                if(err){
                    res.redirect("back");
                }else{
                    console.log(updatedComment);
                    res.redirect("/campgrounds/"+foundCampground._id);
                }
            });
        }
    });
});
router.delete("/:comment_id", isPermitted, function(req, res){
    campground.findOne({_id: req.params.id}, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            comment.findOneAndRemove({_id: req.params.comment_id}, function(err, deletedComment){
                if(err){
                    res.redirect("back");
                }
                else{
                    console.log(deletedComment);
                    res.redirect("/campgrounds/"+foundCampground._id);
                }
            });
        }
    });
});
//=========
//middleware
//=========
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function isPermitted(req, res, next){
    if(req.isAuthenticated()){
       comment.findOne({_id: req.params.comment_id}, function(err, foundComment){
            if(err){
                res.redirect("back");
            }
            else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        }); 
    }else{
        res.redirect("back");
    }
}

module.exports = router;