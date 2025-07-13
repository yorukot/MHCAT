const mongoose = require('mongoose');

const suport = new mongoose.Schema({
    support_id: String,
  })

  module.exports = new mongoose.model('suport', suport)