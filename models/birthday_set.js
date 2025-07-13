const mongoose = require('mongoose');

const birthday_set = new mongoose.Schema({
    guild: String,
    msg: String,
    utc: String,
    channel: String,
    everyone_can_set_birthday_date: Boolean,
    role: String
});

module.exports = new mongoose.model('birthday_set', birthday_set)