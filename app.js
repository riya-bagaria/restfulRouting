var express = require("express");
var methodOverride = require("method-override");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

//APP/CONFIG
mongoose.connect("mongodb://localhost/restful_blog_App");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride("_method"));

//MONGOOSE /MODEL /CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
});
var Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTE
/*Blog.create({
    title:"Dogs Behavious",
    image:"https://www.google.co.in/url?sa=i&rct=j&q=&esrc=s&source=imgres&cd=&cad=rja&uact=8&ved=0ahUKEwiKgdWzjoPVAhVKtY8KHcLoAbQQjRwIBw&url=https%3A%2F%2Fpixabay.com%2Fen%2Fphotos%2Fdog%2F&psig=AFQjCNEX59vh75Q0yZP-53lGwOJG60VbMQ&ust=1499927205232973",
    body:"Hello this is a blog post"
});*/

app.get("/", function (req, res) {
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("ERROR");
        } else {
            res.render("index", {
                blogs: blogs
            });
        }
    });

});

//NEW ROUTE
app.get("/blogs/new", function (req, res) {
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function (req, res) {
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            res.render("new");
        } else {
            //then redirect to the index
            res.redirect("/blogs");
        }
    });
});

//SHOW PAGE
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {
                blog: foundBlog
            });
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {
                blog: foundBlog
            });
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", function (req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog,function(err, updatedBlog){
        if (err) {
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
 Blog.findByIdAndRemove(req.params.id,function(err){
     if(err){
         res.redirect("/blogs");
     }
     else{
         res.redirect("/blogs");
     }
 });
    
});
app.listen(3004, function () {
    console.log("SERVER IS RUNNING");
});