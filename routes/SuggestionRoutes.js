const express = require("express")
const router = express.Router();
const { sendSuggestion } = require("../controllers/SuggestionController")

router.post("/send", sendSuggestion);

module.exports = router;