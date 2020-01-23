const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const registeredSchema = mongoose.Schema({
    email: {type:String, required:true, unique: true},

});

registeredSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Registered', registeredSchema);