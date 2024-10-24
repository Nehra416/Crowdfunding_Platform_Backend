const mongoose = require('mongoose')

const FundraiserSchema = mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    targetAmount: {
        type: Number,
        required: true
    },
    currentAmount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'canceled'],
        default: 'active'
    },
    medical_issue: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    picture:{
        type: String,
        required: true
    },
    doucuments: {
        type: [String],
        // required: true
    },
    bankAccountNumber: {
        type: String,
        required: true
    },
    bankAccountNumber: {
        type: String,
        required: true
    },
    whoDonated: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            amount: {
                type: Number,
                required: true
            },

        }
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            content: {
                type: String,
                required: true
            },
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model('Fundraiser', FundraiserSchema)