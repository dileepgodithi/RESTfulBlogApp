var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');

//app config
mongoose.connect('mongodb://localhost:27017/blog-app',{useNewUrlParser : true, useUnifiedTopology : true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set("view engine", "ejs");
app.use(methodOverride('_method'));

//schema
var blogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body : String,
    created : {type : Date, default : Date.now}
});

//model config
var Blog = mongoose.model('Blog', blogSchema);

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

//edit
app.get('/blogs/:id/edit', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log("error", err);
        }
        else{
            res.render("edit", {blog : foundBlog});
        }
    });
});

//update
app.put('/blogs/:id', function(req, res){
    //console.log(req.params.id);
    //console.log(req.body.blog);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            console.log("error", err);
        }
        else{
            //res.render('show', {blog : updatedBlog});
            //console.log(updatedBlog);
            res.redirect('/blogs/'+req.params.id);
        }
    });
});

app.listen(3000, function(){
    console.log('Blog server started and serving on port 3000');
});