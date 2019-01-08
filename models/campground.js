var mongoose = require("mongoose");
//creating Schema
var campgroundSchema = new mongoose.Schema({
    name        : String,
    url         : String,
    description : String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
            },
        firstname: String,
        lastname: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }
    ]
});

//compiling the schema into a mongoose model
module.exports = mongoose.model("campground", campgroundSchema);