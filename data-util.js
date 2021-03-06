var fs = require('fs');

function loadData() {
    return JSON.parse(fs.readFileSync('data.json'));
}

function saveData(data) {
    var obj = {
        review_posts: data
    };

    fs.writeFileSync('data.json', JSON.stringify(obj));
}

function getAllTags(data) {
    var allTags = [];
    for (var i = 0; i < data.length; i++) {
        var tags = data[i].tags;
        for(var j = 0; j < tags.length; j++) {
            if(!~allTags.indexOf(tags[j])) allTags.push(tags[j]);
        }
    }
    return allTags;
}

module.exports = {
    loadData: loadData,
    saveData: saveData,
    getAllTags: getAllTags
}
