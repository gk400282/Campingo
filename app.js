var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    flash      = require("connect-flash"),
    passport   = require("passport"),
    localStrategy = require("passport-local"),
    campground = require("./models/campground"),
    comment = require("./models/comment"),
    seedDB     = require("./seed"),
    user = require("./models/user"),
    methodOverride = require("method-override"),
    expressSession = require("express-session"),
    connectMongo   = require("connect-mongo")(expressSession)

//requiring various routes   
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes    = require("./routes/comments");
var indexRoutes      = require("./routes/index");
// seedDB(); //seeding the database

//dotenv configuration
require("dotenv").config();

//Connecting flash
app.use(flash());


//connecting to mongoose database
mongoose.connect(`mongodb+srv://rOLDmARGRUV:${process.env.MONGODB_USERPASS}@cluster0.7mi6o.mongodb.net/<dbname>?retryWrites=true&w=majority`, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false, 
    useCreateIndex: true 
}).then(() => {
    console.log("Connected to Database");
}).catch(err => {
    console.log("Error: " + err.message);
});


//Passport Configuration
app.use(expressSession({
    secret: "You are always on my mind P",
    resave: false,
    saveUninitialized: false,
    store: new connectMongo({ mongooseConnection: mongoose.connection })
}));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//sending thisUser to every template
app.use(function(req, res, next){
    res.locals.thisUser = req.user;
    res.locals.error  = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Using various routes
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

//telling app to use body-parser
app.use(bodyParser.urlencoded({extended:true}));

//telling app to use public directory
app.use(express.static(__dirname+"/public"));

//telling app to consider files in the views directory to be of ejs type
app.set("view engine","ejs");

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is listening");
});