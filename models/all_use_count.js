const mongoose = require('mongoose');

const all_use_count = new mongoose.Schema({
    slashcommand_name: String,
    count: Number,
});

module.exports = new mongoose.model('all_use_count', all_use_count)