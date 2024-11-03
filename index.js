require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors')
const connect = require('./config/DbConnection')

// Set up express app and port
const app = express();
PORT = process.env.PORT || 3000;

// Connect to MongoDB database using Mongoose
connect();

// Middleware for parsing JSON request 
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true,
    }
));

// Routes
const userRoutes = require('./routes/userRoutes')
const campaignRoutes = require('./routes/CampaignRoutes')
const donationRoutes = require('./routes/DonationRoutes')
const commentRoutes = require('./routes/CommentRoutes')
const suggestionRoutes = require('./routes/SuggestionRoutes')


app.use('/user', userRoutes);
app.use('/campaign', campaignRoutes)
app.use('/donation', donationRoutes)
app.use('/comment', commentRoutes)
app.use('/suggestion', suggestionRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
