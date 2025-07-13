const mongoose = require('mongoose');

const not_a_good_web = new mongoose.Schema({
    web: String,
});

module.exports = new mongoose.model('not_a_good_web', not_a_good_web)