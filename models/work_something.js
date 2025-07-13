const mongoose = require('mongoose');

const work_something = new mongoose.Schema({
    guild: String,
    name: String,
    time: Number,
    energy: Number,
    coin: Number,
    role: String
});

module.exports = new mongoose.model('work_something', work_something)