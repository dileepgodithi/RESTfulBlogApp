var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//app config
mongoose.connect('mongodb://localhost:27017/blog-app',{useNewUrlParser : true, useUnifiedTopology : true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set("view engine", "ejs");

//schema
var blogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body : String,
    created : {type : Date, default : Date.now}
});

//model config
var Blog = mongoose.model('Blog', blogSchema);

// Blog.create({
//     title : "Test blog",
//     image : "https://images.unsplash.com/photo-1584551882802-ca081b505b49?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1925&q=80",
//     body : "This is a blog application"
//     }, function(err,dbEntry){
//         if(err)
//             console.log("Error", err);
//         else
//             console.log(dbEntry);
// });
//RESTful routes
app.get('/', function(req, res){
    res.redirect('/blogs');
});

//Index
app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs){
        if(err)
            console.log("error", err);
        else
            res.render('index', {blogs : blogs});
    }); 
})
//New
app.get('/blogs/new', function(req, res){
    res.render('new');
});

//Create
app.post('/blogs', function(req, res){
    Blog.create(req.body.blog, function(err, newEntry){
        if(err){
            console.log("Error", err);
        }
        else{
            res.redirect('/blogs');
        }
    });
});

//show
app.get('/blogs/:id', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log("error", err);
        }
        else{
            res.render('show',{blog:foundBlog});
        }
    });
});

app.listen(3000, function(){
    console.log('Blog server started and serving on port 3000');
});