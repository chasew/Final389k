var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var reviewSchema = new mongoose.Schema({});
var menuSchema = new mongoose.Schema({});

var reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 0.0,
        max: 5.0,
        required: true
    },
    comment: {
        type: String
    },
    author: {
        type: String,
        required: true
    }
});

var menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
});

var restaurantSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    food: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    //menu: [menuSchema],
    //reviews: [reviewSchema]
});

var Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;