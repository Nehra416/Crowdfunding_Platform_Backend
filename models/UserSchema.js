const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    donated: [
        {
            fundraiser: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Fundraiser'
            },
            amount: {
                type: Number,
                default: 0,
                required: true
            },
            date: {
                type: Date,
                default: Date.now()
            }
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema);