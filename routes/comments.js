var express = require("express");
var router  = express.Router({mergeParams: true});
var campground = require("../models/campground");
var comment = require("../models/comment");
var bodyparser = require("body-parser");
var middleware = require('../middleware');

router.use(bodyparser.urlencoded({extended:true}));
//============
//Comments routes
//============

router.get("/new", middleware.isLoggedIn, function(req, res){
    campground.findById(req.params.id, function( err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "The campground you are trying to add comment to does not exist!");
            res.redirect("/campgrounds");
        }
        else{
            res.render("comments/addComments", { campground: foundCampground});
        }
    });
});
router.post("/", middleware.isLoggedIn, function(req, res){
    campground.findById(req.params.id).populate("comments").exec(function( err, thisCampground){
        if(err || !thisCampground){
            console.log("New comments POST route error - " + err.message);
            req.flash("error", `New comments POST route error - ${err.message}`);
            res.redirect("/campgrounds");
        }
        else{
            comment.create(req.body.comment, function(err, comment){
                if(err || !comment){
                    console.log(err);
                    req.flash("error", `Database error while adding comment - ${err.message}`);
                    res.redirect(`/campgrounds/${thisCampground._id}`);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.firstname = req.user.firstname;
                    comment.author.lastname = req.user.lastname;
                    comment.save();
                    thisCampground.comments.push(comment);
                    thisCampground.save();
                    req.flash("success", "Successfully added comment!");
                    res.redirect(`/campgrounds/${thisCampground._id}`);
                }
            });
        }
    });
});
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    campground.findOne({_id: req.params.id}, function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error", "Campground not found!");
            res.redirect("/campgrounds");
        }else{
            comment.findOne({_id: req.params.comment_id}, function(err, foundComment){
                if(err || !foundComment){
                    req.flash("error", "Error while updating comment. Oops!")
                    res.redirect("/campgrounds");
                }else{
                    res.render("comments/edit", {campground: foundCampground, comment: foundComment});
                }
            });
        }
    });
});
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    campground.findOne({_id: req.params.id}, function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error", "Campground not found!");
            res.redirect("/campgrounds");
        }else{
            comment.findOneAndUpdate({_id: req.params.comment_id}, req.body.comment, function(err, updatedComment){
                if(err || !updatedComment){
                    req.flash("error", "Error while updating comment. Oops!")
                    res.redirect("/campgrounds");
                }else{
                    console.log(updatedComment);
                    req.flash("success", "Comment updated!");
                    res.redirect("/campgrounds/"+foundCampground._id);
                }
            });
        }
    });
});
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    campground.findOne({_id: req.params.id}, function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error", "Campground not found!");
            res.redirect("/campgrounds");
        }else{
            comment.findOneAndRemove({_id: req.params.comment_id}, function(err, deletedComment){
                if(err || !deletedComment){
                    req.flash("error", "Error while deleting comment. Oops!")
                    res.redirect("/campgrounds");
                }
                else{
                    console.log(deletedComment);
                    req.flash("success", "Comment deleted!");
                    res.redirect("/campgrounds/"+foundCampground._id);
                }
            });
        }
    });
});



module.exports = router;