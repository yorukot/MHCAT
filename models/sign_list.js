const mongoose = require('mongoose');

const sign_list = new mongoose.Schema({
    guild: String,
    member: String,
    date: Object,
});

module.exports = new mongoose.model('sign_list', sign_list)