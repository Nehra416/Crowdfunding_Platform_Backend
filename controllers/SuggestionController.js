const Suggestion = require("../models/SuggestionSchema")

const sendSuggestion = async (req, res) => {
    try {
        const { name, email, content } = req.body;
        console.log(req.body)
        // all fields are required
        if (!name || !email || !content) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        }

        // create a new suggestion
        await Suggestion.create({
            name, email, content
        })

        return res.status(201).json({
            message: "Your Suggestion send Successfully",
            success: true
        })

    } catch (error) {
        console.log("Error in sendSuggestion :", error)
        return res.status(500).json({
            message: "Something went wrong",
            success: false
        })
    }
}

module.exports = { sendSuggestion };