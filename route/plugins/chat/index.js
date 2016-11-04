const Handlers = require('./handlers');
const socketioJwt = require('socketio-jwt');
const secret = require('../../../config');

exports.register = function (server, options, next) {

    var io = require('socket.io')(server.listener);

    io.use(socketioJwt.authorize({
    	secret: secret,
    	handshake: true
    }));

    io.on('connection', function (socket) {

        console.log('New connection!');

     //    io.emit('hello', function (action) {
     //    	console.log(action, 'hello');
    	// });

        socket.on('hello', Handlers.hello);
        socket.on('newMessage', Handlers.newMessage);
        socket.on('goodbye', Handlers.goodbye);
        socket.on('chat message', function(msg){
        	console.log('User message:' + msg);
        	io.emit('chat message', msg);
        });
    });

    next();
};

exports.register.attributes = {
    name: 'hapi-chat'
};