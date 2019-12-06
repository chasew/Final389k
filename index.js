var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var dataUtil = require("./data-util");
var _ = require("underscore");
var logger = require('morgan');
var exphbs = require('express-handlebars');
var handlebars = exphbs.handlebars;
var moment = require('moment');
var marked = require('marked');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var app = express();
var Restaurant = require('./models/Restaurant');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var timefunction = require('./module1.js');

var _DATA = dataUtil.loadData().review_posts;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));


//TRYING TO USE MONGO :(

// Load envirorment variables
dotenv.config();


// Connect to MongoDB
console.log(process.env.MONGODB)
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

//END MONGO CODE

app.get('/', function (req, res) {
    var tags = dataUtil.getAllTags(_DATA);
    
    console.log(_DATA)
    console.log(tags)

    Restaurant.find({}, function(err, rests) {
        if (err) throw err;
        //res.send(rests);
        console.log(rests);
    });
    res.render('home', {
        data: _DATA,
        tags: tags
    });
})

app.get("/create", function (req, res) {
    var tags = dataUtil.getAllTags(_DATA);
    res.render('create', {
        tags: tags
    });
});

app.get("/about", function (req, res) {
    console.log("Thanks for clicking".rainbow);
    var tags = dataUtil.getAllTags(_DATA);
    res.render('about', {
        tags: tags
    });
});

app.get("/error", function (req, res) {
    console.log("Sorry about the error".rainbow);
    var tags = dataUtil.getAllTags(_DATA);
    res.render('404', {
        tags: tags
    });
});

app.get("/extra", function (req, res) {
    res.render('extra', {});
});

app.post('/create', function (req, res) {
    var body = req.body;
    // Transform tags and content 
    body.tags = body.tags.split(" ");
    body.content = marked(body.content);
    // Add time and preview
    body.preview = body.content.substring(0, 300);
    body.time = moment().format('MMMM Do YYYY, h:mm a');
    var rating = parseInt(body.review);
    if (rating == 5) {
        body.tags.push("5Star");
    }
    // Save new blog post
    _DATA.push(req.body);
    dataUtil.saveData(_DATA);
    res.redirect("/");
});

app.get('/post/:slug', function (req, res) {
    var _slug = req.params.slug;
    var blog_post = _.findWhere(_DATA, { slug: _slug });
    if (!blog_post) return res.render('404');
    res.render('post', blog_post);
});

app.get('/tag/:tag', function (req, res) {
    var tags = dataUtil.getAllTags(_DATA);
    var tag = req.params.tag;
    var posts = [];

    _DATA.forEach(function (post) {
        if (post.tags.includes(tag)) {
            posts.push(post);
        }
    });
    res.render('home', {
        tag: tag,
        data: posts,
        tags: tags
    });
});

app.get('/nav/Newest', function (req, res) {
    //ordered by time and date
    var tags = dataUtil.getAllTags(_DATA);

    var d1 = new Date();
    var d2 = new Date(d1);

    var newLst = _.sortBy(_DATA, "time");
    newLst = newLst.reverse();

    var posts = [];
    newLst.forEach(function (post) {
        if (!posts.includes(post)) {
            posts.push(post);
        }
    });

    res.render('home', {
       
        data: posts,
        tags: tags
    });
});

app.get('/nav/Alphabetical', function (req, res) {
    //alphabetical by restaurant name
    var tags = dataUtil.getAllTags(_DATA);
    var newLst = _.sortBy(_DATA, "restaurant_name");
    
    var posts = [];
    newLst.forEach(function (post) {
        if (!posts.includes(post)) {
            posts.push(post);
        }
    });

    res.render('home', {
        data: posts,
        tags: tags
    });
});

app.get('/nav/Search/:name', function (req, res) {
    //by restaurant name

    var name = req.params.name;
    var posts = [];

    _DATA.forEach(function (post) {
        var sub = post["restaurant_name"];
        if (sub.includes(name)) {
            posts.push(post);
        }
        
    });
    res.render('home', {
        data: posts,
        input: name
    });
});

app.get('/nav/Search/', function (req, res) {
    var tags = dataUtil.getAllTags(_DATA);
    if (!tags) {
        res.send("There are no matches")
    }
    res.render('home', {
        data: _DATA,
        tags: tags
    });
});

app.get('/nav/Random', function (req, res) {
    //random posts
    var tags = dataUtil.getAllTags(_DATA);
    var newLst = [];
    for (var i = 0; i < _DATA.length - 1; i++) {
        var j = i + Math.floor(Math.random() * (_DATA.length - i));

        var temp = _DATA[j];
        newLst[j] = _DATA[i];
        newLst[i] = temp;
    }

    var posts = [];
    newLst.forEach(function (post) {
        if (!posts.includes(post)) {
            posts.push(post);
        }
    });

    res.render('home', {
        data: posts,
        tags: tags
    });
});

app.get('/api', function (req, res) {

    Restaurant.find({}, function(err, restaurants) {
        if (err) throw err;
        res.send(restaurants);
    });

});

app.post('/api/create/', function (req, res) {
    var u = req.body.user;
    var r = req.body.restaurant_name;
    var s = req.body.slug;
    var array = req.body.tags;
    var c = req.body.content;
    var review = req.body.review;

    if (!u) { res.json({}); };
    if (!r) { res.json({}); };
    if (!s) { res.json({}); }
    if (!array) { res.json({}); };
    if (!c) { res.json({}); };
    if (!review) { res.json({}); };


    var review = new Restaurant({
        title: req.body.restaurant_name,
        food: req.body.tags.toString(),
        rating: parseInt(req.body.review)
    });

    review.save(function(err) {
        if (err) throw err;
        //res.redirect("/");
        //return res.send('Succesfully inserted movie.');
    });

    /*
    // Transform tags and content 
    body.tags = body.tags.split(" ");
    body.content = marked(body.content);

    // Add time and preview
    body.preview = body.content.substring(0, 300);
    body.time = moment().format('MMMM Do YYYY, h:mm a');
    var rating = parseInt(body.review);
    if (rating == 5) {
        body.tags.push("5Star");
    }

    // Save new blog post
    //_DATA.push(req.body);
    dataUtil.saveData(_DATA);
    res.json(s);
    */

   var body = req.body;
   // Transform tags and content 
   body.tags = body.tags.split(" ");
   body.content = marked(body.content);
   // Add time and preview
   body.preview = body.content.substring(0, 300);
   body.time = timefunction.getTime();
   var rating = parseInt(body.review);
   if (rating == 5) {
       body.tags.push("5Star");
   }
   // Save new blog post
   _DATA.push(req.body);
   dataUtil.saveData(_DATA);
   res.redirect("/");
});

app.delete('/api/slug/:slug/remove/:tag', function (req, res) {
    var _name = req.params.slug;
    if (!_name) { res.json({}); };
    var _tag = req.params.tag
    var result = _.findWhere(_DATA, { slug: _name })
    if (!result) { return res.json({}); };
    var newArray = [];

    for (var i in result["tags"]) {
        if (result["tags"][i] != _tag) {
            newArray.push(result["tags"][i]);
        }
    }
    result.tags = newArray;
    var s = { slug: _name, tags: newArray }
    dataUtil.saveData(_DATA);
    res.json(s);
});

app.delete('/', function (req, res) {

});

app.get('/chatRoom', function (req, res) {
    var tags = dataUtil.getAllTags(_DATA);
    res.render('chat', {
        data: _DATA,
        tags: tags
    });
});

http.listen(3000, function() {
    console.log('Listening on port 3000!');
});

io.on('connection', function(socket) {
    console.log('NEW connection');
    /*
        - Handle listening for "messages"
            -> socket.on(message, function(msg)){...}
        - Sending out messages to ALL clients currently connected
            -> io.emit(message, contentOfMessage)
    */

    /*        ===================TASK 1====================
        TASK 1 (SERVER END): Handle a new chat message from a client
        Steps to compelete task 1 on server end.
            1. Listen for a new chat message
            2. Emit new chat message to all clients currently connected
    */
   //Task 1 - Step 1: Listen for a new chat message
    socket.on('chat message', function(msg) {
        //Task 2 - Step 2: Emit new chat message to all clients currently connected
        io.emit('chat message', msg);
    })


    socket.on('disconnect', function() {
        console.log('User has disconnected');
    });
});