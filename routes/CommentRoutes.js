const express = require('express');
const { addComment, getAllComments, deleteComment } = require('../controllers/CommentController');
const checkAuthentication = require('../middlewares/Authentication');
const router = express.Router();

router.post('/add/:id', checkAuthentication, addComment)
router.get('/all/:id', getAllComments)
router.delete('/delete/:id', checkAuthentication, deleteComment)

module.exports = router;