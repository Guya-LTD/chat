var models = require('../models');
var Messages = models.Messages


/** GET all messages for specfic user */
exports.getAll = async function(req, res, next){
    try{
        var customerId = req.params.customerId;

        const messages = await Messages.findAll({attributes: ['sender', customerId]});

        if(messages.every(messages => messages instanceof Messages))
            return res.status(200).json({ status: 200, data: messages, message: "Ok" });
        else
            return res.status(204).json({ status: 204, data: [], message: "No Content" });
    }catch(error){
        next(error)
    }
}

/** POST create new message */
exports.post = async function(req, res, next){
    return "hello";
}