const mongoose = require('mongoose');

const code = new mongoose.Schema({
    code: String,
    price: Number,
    time: Number
})

module.exports = new mongoose.model('code', code)