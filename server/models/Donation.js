const mongoose = require('mongoose');
const { Schema } = mongoose;

const donationSchema = new Schema(
    {
        price: 
        {
            type: Number,
            required: true,
            min: 0.01
        },
       
    }
);

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;