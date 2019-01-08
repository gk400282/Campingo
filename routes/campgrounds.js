var express = require("express");
var router  = express.Router();
var campground = require("../models/campground");
var bodyparser = require("body-parser");

router.use(bodyparser.urlencoded({extended:true}));
//============
//campgrounds routes
//============

router.get("/",function(req, res){
    campground.find({},function(err, allCampgrounds){
        if(err){
            console.log("something went wrong");
        }
        else{
            res.render("campgrounds/campgrounds",{data: allCampgrounds});
        }
    });
});

router.post("/", isLoggedIn, function(req, res){
    var name = req.body.searchName;
    var link = req.body.searchLink;
    var description = req.body.descript;
    var author = {
        id: req.user._id,
        firstname: req.user.firstname,
        lastname: req.user.lastname
    }
    campground.create(
        {
            name:name, 
            url:link,
            description:description,
            author: author
        },function(err, campground){
            if(err){
                console.log("something went wrong"+err);
            }
            else{
                console.log("New campground created"+campground);
            }
        });
    res.redirect("/campgrounds");
});
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/addCampgrounds");
});

router.get("/:id", function(req, res){
    campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log("something went wrong");
        }
        else{
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
});
router.get("/:id/edit", isPermitted, function(req, res){
    campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("back");
        }else{
            res.render("campgrounds/edit",{campground: foundCampground});
        }
    });
});
router.put("/:id", isPermitted, function(req, res){
    campground.findOneAndUpdate({_id: req.params.id}, req.body.campground, function(err, updatedCampground){
        if(err){
            console.log("something went wrong");
            res.redirect("/campgrounds/"+req.params.id);
        }
        else{
            console.log(updatedCampground);
            res.redirect("/campgrounds/"+updatedCampground._id);
        }
    });
});

router.delete("/:id", isPermitted, function(req, res){
    campground.findOneAndRemove({_id: req.params.id}, function(err, deletedCampground){
        if(err){
            console.log("something went wrong");
            res.redirect("/campgrounds");
        }
        else{
            console.log(deletedCampground);
            res.redirect("/campgrounds");
        }
    });
})
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
       campground.findOne({_id: req.params.id}, function(err, foundCampground){
            if(err){
                res.redirect("back");
            }
            else{
                if(foundCampground.author.id.equals(req.user._id)){
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