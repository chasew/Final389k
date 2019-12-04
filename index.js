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
var app = express();


var _DATA = dataUtil.loadData().review_posts;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));



app.get('/', function (req, res) {
    var tags = dataUtil.getAllTags(_DATA);
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
    var contents = '';
    for (x in _DATA) {
        contents.concat(x + "\n");
    }
    res.json(_DATA)
});

app.post('/api/create/:username/:restaurant_name/:slug/:array/:content/:review', function (req, res) {
    var u = req.params.username;
    var r = req.params.restaurant_name;
    var s = req.params.slug;
    var array = req.params.array;
    var c = req.params.c;
    var review = req.params.review;

    if (!u) { res.json({}); };
    if (!r) { res.json({}); };
    if (!s) { res.json({}); }
    if (!array) { res.json({}); };
    if (!c) { res.json({}); };
    if (!review) { res.json({}); };

    var body = req.body;
    body.push(u);
    body.push(r);
    body.push(s);
    body.push(array);
    body.push(c);
    body.push(review);

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

app.listen(3000, function() {
    console.log('Listening on port 3000!');
});
