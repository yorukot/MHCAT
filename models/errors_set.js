const mongoose = require('mongoose');

const errors_set = new mongoose.Schema({
    guild: String,
    ban_count: String,
    move: String
});

module.exports = new mongoose.model('errors_set', errors_set)