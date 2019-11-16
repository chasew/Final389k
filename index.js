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

/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5
 * endpoints for the API, and 5 others.
 */

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

app.post('/api/create/:username/:restaurant_name/:slug/:array/:content/:review', function (req, res) {

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

app.listen(3000, function() {
    console.log('Listening on port 3000!');
});
