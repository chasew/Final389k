var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb+srv://fall19:cmsc389k@cmsc389k-2t3g2.mongodb.net/test?retryWrites=true&w=majority";


var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var dotenv = require('dotenv');
var Restaurant = require('./models/Restaurant');


// Load envirorment variables
dotenv.load();


// Connect to MongoDB
//console.log(process.env.MONGODB)
mongoose.connect("mongodb://localhost/3000", { useNewUrlParser: true });

mongoose.connection.on('error', function () {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

// Setup Express App
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/post', function (req, res, next) {
    // Create new movie
    var post = new Restaurant({
        title: req.body.title,
        food: req.body.food,
        price: parseInt(req.body.price),
        menu: [],
        reviews: []
    });
    
    // Save movie to database
    post.save(function (err, post) {
        if (err) return next(err);
        return res.send('Succesfully inserted restaurant.');
    });

});

app.delete('/restaurant/:id', function (req, res) {
    // Find movie by id
    Restaurant.findByIdAndRemove(req.params.id, function (err, restaurant) {
        if (err) throw err;
        if (!restaurant) {
            return res.send('No restaurant found with that ID.');
        }
        res.send('Restaurant deleted!');
    });
});

app.get('/restaurant', function (req, res) {
    // Get all Restaurants
    Restaurant.find(function (err, restaurant) {
        if (err) return next(err);
        res.send(restaurant);
    });
});

app.get('/restaurant', function(req,res){
    Restaurant.find({}, function (err, restaurant) {
        if (err) throw err;
        res.send(restaurant);
    });
}
app.listen(3000, function () {
    console.log('App listening on port 3000!');
})


