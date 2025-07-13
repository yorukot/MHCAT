const mongoose = require('mongoose');

const system = new mongoose.Schema({
    a: String,
    ram: Array,
    cpu: Array
});

module.exports = new mongoose.model('system', system)