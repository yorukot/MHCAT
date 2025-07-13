const mongoose = require('mongoose');

const birthday = new mongoose.Schema({
    guild: String,
    user: String,
    birthday_year: Number,
    birthday_month: Number,
    birthday_day: Number,
    send_msg_hour: Number,
    send_msg_min: Number,
    allow: Boolean
});

module.exports = new mongoose.model('birthday', birthday)