const { model, Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const Order = require('./Order');


const userSchema = new Schema({
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure uniqueness of email field
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: String,

    keptBooks: [{
        type: Schema.Types.Mixed,
        ref: 'Book'
    }],
    orders: [Order.schema]
},
    {
        timestamps: true
    });

// pre('save') enacts middleware to perform logic before or after a specified action; in this case it wants to run this conditional logic before we save the document to the database.
// pass in next cb fn to use it at the end, this way this ensure the logic here runs before anything else in the process.
userSchema.pre('save', async function (next) {
    // these methods are Mongoose booleans to check state of document; this refers to User document.
    if (this.isNew || this.isModified('password')) {
        // put in variable in case we use it more and can simply change variable rather thane very place.
        const hashRounds = 10;
        this.password = await bcrypt.hash(this.password, hashRounds);
    }

    next();
});

// methods is convention to define this method and attach it to each document made according to this model.
userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;
