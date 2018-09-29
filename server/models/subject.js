var mongoose = require('mongoose');
require('mongoose-type-email');
var Subject = mongoose.model('Subject', {
    name:{
        type: "String",
        unique:true
    }
});
module.exports = {
    Subject
};