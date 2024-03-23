const mongoose = require('mongoose');
const { Schema } = mongoose;

const donationSchema = new Schema(
    {
        name:
        {
            type: String,
            required: true,
            trim: true
        },
        price: 
        {
            type: Number,
            required: true,
            min: 0.01
        },
        donationDate:
        {
            type: Date,
            default: Date.now
        },
       
    }
);

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;