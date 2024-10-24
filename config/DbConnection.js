const mongoose = require('mongoose');

// Connect to MongoDB
const connect = () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.log("Can't connect to MongoDB", err));
}

module.exports = connect;