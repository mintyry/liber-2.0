const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema(
    {
        orderDate:
        {
            type: Date,
            default: Date.now
        },
        donation:
        {
            type: Schema.Types.ObjectId,
            ref: 'Donation'
        }
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;