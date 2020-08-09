var models = require('../models');
var Messages = models.Messages


/** GET all messages for specfic user */
exports.getAll = async function(req, res, next){
    try{
        var userId = req.params.userId;
        console.log(userId);

        const messages = await Messages.findAll({where: {sender: userId}});
        //const messages = await Messages.findAll();
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
    try{
        const message = await Messages.create({ sender: req.params.userId, recipient: req.body.recipient, content: req.body.content});
        if(message.id == null)
            throw Error(500, 'Internal Server Error');
        else{
            return res.status(201).json({ status: 201, data: [{ id: message.id }], message: "Created"})
        }
    }catch(error){
        next(error);
    }
}