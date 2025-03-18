const e = require('cors');
const mongoose = require('mongoose');

const contactusSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    phone: {
        type: String,
        required: true,
    },

    chooseProperty: {
        type:String,
        enum:['Villa', 'Townhouse', 'Penthouse', 'Apartment'],
        required: false,
    },

    profession: {
        type: String,
        enum: ['Employed', 'Business', 'Student', 'Other'],
        required: false,
    },

    message: {
        type: String,
        required: true,
    },
    createdAt: {  // Added timestamp field
        type: Date,
        default: Date.now,
    },
    
});

module.exports = mongoose.model('Contactus', contactusSchema);