const mongoose = require('mongoose');

const ann_all_set = new mongoose.Schema({
    guild: String,
    announcement_id: String,
    tag: String,
    color: String,
    title: String,
});

module.exports = new mongoose.model('ann_all_set', ann_all_set)