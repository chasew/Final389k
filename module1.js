var moment = require('moment');

function getTime() {
    return moment().format('MMMM Do YYYY, h:mm a');
}

module.exports = {
    getTime: getTime
}