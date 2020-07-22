var express = require("express");
var router  = express.Router();
var campground = require("../models/campground");
var bodyparser = require("body-parser");
var middleware = require('../middleware');

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

router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.searchName;
    var link = req.body.searchLink;
    var price = req.body.price;
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
        price:price,
        description:description,
        author: author
    },function(err, campground){
        if(err || !campground){
            console.log("something went wrong" + err);
            req.flash("error","Campground addition unsuccessful - err.message");
            res.redirect("/campgrounds");
        }
        else{
            console.log("New campground created" + campground);
            req.flash("success", "Successfully added campground!");
            res.redirect(`/campgrounds/${campground._id}`);
        }
    });
    //res.redirect("/campgrounds");
});
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/addCampgrounds");
});

router.get("/:id", function(req, res){
    campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            console.log("Campground not found!");
            req.flash("error", "Campground not found!");
            res.redirect("/campgrounds");
        }
        else{
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
});
router.get("/:id/edit", middleware.checkCampgroundOwernership, function(req, res){
    campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found!");
            res.redirect("/campgrounds");
        }else{
            res.render("campgrounds/edit",{campground: foundCampground});
        }
    });
});
router.put("/:id", middleware.checkCampgroundOwernership, function(req, res){
    campground.findOneAndUpdate({_id: req.params.id}, req.body.campground, function(err, updatedCampground){
        if(err || !updatedCampground){
            console.log("something went wrong");
            console.log(req.body.campground);
            req.flash("error", "Campground updation unsuccessful!");
            res.redirect("/campgrounds/"+req.params.id);
        }
        else{
            console.log(updatedCampground);
            req.flash("success", "Successfully updated campground details!")
            res.redirect("/campgrounds/"+updatedCampground._id);
        }
    });
});

router.delete("/:id", middleware.checkCampgroundOwernership, function(req, res){
    campground.findOneAndRemove({_id: req.params.id}, function(err, deletedCampground){
        if(err || !deletedCampground){
            console.log("something went wrong");
            req.flash("error", "Campground deletion unsuccessful!");
            res.redirect("/campgrounds");
        }
        else{
            console.log(deletedCampground);
            req.flash("success", "Successfully deleted campground details!")
            res.redirect("/campgrounds");
        }
    });
})

module.exports = router;