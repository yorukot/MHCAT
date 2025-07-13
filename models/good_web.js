const mongoose = require('mongoose');

const good_web = new mongoose.Schema({
    guild: String,
    open: Boolean,
});

module.exports = new mongoose.model('good_web', good_web)