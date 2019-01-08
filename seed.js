var mongoose = require("mongoose");
var campground = require("./models/campground");
var comment    = require("./models/comment");

var data = [
    {
        name: "Cloud's nest",
        url: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
        description: "Camping outside a designated campsite may be forbidden by law. It is thought to be a nuisance, harmful to the environment, and is often associated with vagrancy. However some countries have specific laws and/or regulations allowing camping on public lands (see Freedom to roam). In the United States, many national and state parks have dedicated campsites and sometimes also allow impromptu backcountry camping by visitors. U.S. National Forests often have established campsites, but generally allow camping anywhere, except within a certain distance of water sources or developed areas."
    },
    {
        name: "Rita's choice",
        url: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        description: "Camping outside a designated campsite may be forbidden by law. It is thought to be a nuisance, harmful to the environment, and is often associated with vagrancy. However some countries have specific laws and/or regulations allowing camping on public lands (see Freedom to roam). In the United States, many national and state parks have dedicated campsites and sometimes also allow impromptu backcountry camping by visitors. U.S. National Forests often have established campsites, but generally allow camping anywhere, except within a certain distance of water sources or developed areas."
    },
    {
        name: "Goolash garden",
        url: "https://images.pexels.com/photos/1539225/pexels-photo-1539225.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
        description: "Camping outside a designated campsite may be forbidden by law. It is thought to be a nuisance, harmful to the environment, and is often associated with vagrancy. However some countries have specific laws and/or regulations allowing camping on public lands (see Freedom to roam). In the United States, many national and state parks have dedicated campsites and sometimes also allow impromptu backcountry camping by visitors. U.S. National Forests often have established campsites, but generally allow camping anywhere, except within a certain distance of water sources or developed areas."
    }
]

function seedDB(){
    campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Campground removed!");
            comment.deleteMany({}, function(err){
            if(err){
                console.log("Comment deletion Error"+err);
            }else{
                data.forEach(function(seed){
                    campground.create(seed, function(err, campground){
                        if(err){
                            console.log(err + "- Error while seeding");
                        }else{
                            console.log("added a campground");
                            comment.create({
                                text: "You people are sick man. This is not a place where you wanna camp. There are hill-billies out there!",
                                author: "Rold"
                            }, function(err, comment){
                                if(err){
                                    console.log("Comments creation error"+err);
                                }else{
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Comment added");
                                }
                            });
                        }
                    });
                });
            }
            });
        }
    });
}
module.exports = seedDB;