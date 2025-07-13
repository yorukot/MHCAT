const mongoose = require('mongoose');

const work_user = new mongoose.Schema({
    guild: String,
    user: String,
    state: String,
    end_time: Number,
    energi: Number,
    get_coin: Number
});

module.exports = new mongoose.model('work_user', work_user)