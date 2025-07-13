const mongoose = require('mongoose');

const vote = new mongoose.Schema({
    guild: String,
    Number: String,
    member: Array,
    vote: Array,
});

module.exports = new mongoose.model('vote', vote)