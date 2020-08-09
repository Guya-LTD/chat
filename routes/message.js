var express = require('express');
var router = express.Router();

var messageController = require('../controllers/message');

/* GET messages of user's. */
router.get('/v1/chats/:userId/messages', messageController.getAll);

/** POST create new message */
router.post('/v1/chats/:userId/messages', messageController.post)

module.exports = router;
