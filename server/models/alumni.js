var mongoose = require('mongoose');
require('mongoose-type-email');
var Alumni = mongoose.model('Alumni', {
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    subjects: [{
        name:{
            type: String,
            required:true
        }
    }],
    details: {
        type: String,
        default: ""
    },
    watch_counter: {
        type: Number,
        default: 0
    },
    phone_counter: {
        type: Number,
        default: 0
    },
    mail_counter: {
        type: Number,
        default: 0
    }
});
module.exports = {
    Alumni
};