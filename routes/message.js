var express = require('express');
var router = express.Router();

var messageController = require('../controllers/message');

/* GET messages of cutomer's. */
router.get('/v1/chats/:customerId/messages', messageController.getAll);

/** POST create new message */
router.get('/v1/chats/:customerId/messages', messageController.post)

module.exports = router;
