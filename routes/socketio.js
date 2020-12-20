var socket_io = require('socket.io');
const axios = require('axios');

var io = socket_io();

const gatekeeper_url = 'http://gatekeeper:4000/api/v1/auth/jwt';

/**
 * list of sockets waiting for peers
 */
var queue = [];

/** 
 * Online customers list
 */
var customers = {};

/** 
 * Online customer services
 */
var supports = {};

/** 
 * Customer service online users
 */
var rooms = [];

/**
 * Maximum number of support can handle customers room.
 */
var maxroom = 2;

// scoket.io middleware
// OTI Authentication
io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.name && socket.handshake.query.type){
       socket.name = socket.handshake.query.name;
       socket.type = socket.handshake.query.type;
    }else{
       return next(new Error('Name and Type is required'));
    }
    /*socket.oti = 'oti' +  Math.random()
    socket.user = {
        username: 'username' + Math.random(),
        code: 'code' + Math.random()
    }*/

    //console.log('middleware');
    next();
});

// Handle connection
io.on('connection', function (socket) {

    /**
     * Get total online supports.
     */
    socket.on('support:connection:count', function(data) {
        socket.emit('support:connection:count', Object.keys(supports).length.toString());
    });

    /**
     * Step 1 for customer
     * Add and notify that new customer is joined/online.
     */
    socket.on('customer:connection:join', function() {
        // Get current socket state datas.
        // Add empty room on supports first joining the connection.
        //customer = { oti: socket.oti, socket: socket, user: socket.user, room: null };
        //customers[socket.oti] = customer;
        customer = { name: socket.name, type: socket.type, socket: socket, room: null };
        customers[socket.name] = customer;
        socket.emit('customer:connection:created', socket.user);
    });

    /**
     * Create room for customer.
     */
    socket.on('customer:room:create', function() {
        // Check if any support user is online.
        if(Object.keys(supports).length) socket.emit('support:count:notify', 0);
        // One user cannot create morethan one room at a time or atleaset that room must be
        // deleted/removed.
        // Create room by adding oti with socket id for unique room var.
        room = socket.id + '#' + socket.oti;
        // Prevent from adding same room in rooms.
        if(rooms.indexOf(room) == -1) rooms.push(room);
        // Set the room to curent socket globaly
        socket.room = room;
        // Tell customer their room is created nothing more.
        socket.emit('customer:room:created', room);
    });

    /**
     * Add support to customers room.
     * Here create room and assign randommly support user i.e add support to users room.
     */
    socket.on('support:room:join', function() {
        // Check if any support user is online.
        if(Object.keys(supports).length) socket.emit('support:count:notify', 0);
        // Select/try selecting support user that have joined the least rooms
        // Fist step create new room for the user, and one user cannot join more than one room
        // or atleast that room must be deleted/removed.
        // Join current socket.
        socket.join(socket.room);
        // And add support to this/current room.
        var min_rooms = 0, min_oti;

        for(const [key, value] of Object.entries(supports)) {
            // First chance found, if support has 0 room immediately as one.
            if(value.rooms.length == 0) min_oti = key;
            if(value.rooms.length < min_rooms) {
              min_rooms = value.rooms.length;
              min_oti = key;
            }
        };
        // Join user and customer support 
        try{ supports[min_oti].socket.join(socket.room); }catch(error){socket.emit('error:room:join', 'There is not support')}
    });

    /**
     * Step 1 for support/admin
     * Add/notify support is joining online/connection.
     */
    socket.on('support:connection:join', function() {
        // Get current socket state datas.
        // Add empty room on supports first joining the connection.
        //support = { oti: socket.oti, socket: socket, user: socket.user, rooms: [] };
        //supports[socket.oti] = support;
        support = { name: socket.name, type: socket.type, socket: socket, rooms: [] };
        supports[socket.name] = support;
        // Notify the support user the total number of online users and waiting users.
        total_online = Object.keys(customers).length;
        waiting_customers = Object.keys(customers).length - Object.keys(supports).length * maxroom
        // If toal waiting custtomers is 0 and +ve all supports are taken, else if its negitive number
        // there is room for the user.
        if(waiting_customers < 0) waiting_customers = 0;
        socket.emit('support:customers:count:notify', { total: total_online, waiting: waiting_customers });
    });

    /**
     * Recive Chat
     */
    socket.on('chat:message:send', function(data) {
        console.log(data);
        socket.emit('chat:message:receive', 'Abcd');
        //io.sockets.socket(data.room).emit('chat:message:receive', data.message); 
        //io.emit('chat:message:receive', data.message);
        socket.broadcast.to(data.room).emit('chat:message:receive', data.message);
    })

    /**
     * Disconnect
     */
    socket.on('disconnect', function() {
        // Check if customer is disconnected and pop romms
        // based on type
        if(socket.type == 'support')
            delete supports[socket.name];
        else if (socket.type == 'customer')
            delete customers[socket.name];
    }) 
});


exports.io = io;