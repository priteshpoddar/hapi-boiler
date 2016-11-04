'use strict';

const Hapi = require('hapi');
const Boom = require('boom');
const mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');
const secret = require('./config');
const Hoek = require('hoek');
// const Inert = require('inert');


const server = new Hapi.Server();

// The connection object takes some
// configuration, including the port
server.connection({ port: 3000 });

// const io = require('socket.io')(server.listener);

// io.on('connection', function(socket){
//     console.log(socket);

//     socket.emit('Hiiiiii');

//     socket.on('burp', function(){
//         socket.emit('Excuse you!');
//     });

// });

const dbUrl = 'mongodb://localhost:27017/user-app';

// var options = {
//     reporters: [{
//         reporter: require('good-console'),    // Log everything to console
//         events: { log: '*' }
//     }, {
//         reporter: require('good-file'),       // Log 'debug' to debug_log.log
//         events: { log: 'debug' },
//         config: 'debug_log.log'
//     }, {
//         reporter: require('good-file'),       // Log 'error' to error_log.log
//         events: { log: 'error' },
//         config: 'error_log.log'
//     }]
// };

const options1 = {
    query: {
      page: {
        name: 'page' // The page parameter will now be called page
      },
      limit: {
        name: 'per_page', // The limit will now be called per_page
        default: 3       // The default value will be 10
      }
    },
     meta: {
        name: 'metadata', // The meta object will be called metadata
        count: {
            active: true,
            name: 'count'
        },
        pageCount: {
            name: 'totalPages'
        },
        self: {
            active: false // Will not generate the self link
        },
        first: {
            active: false // Will not generate the first link
        },
        last: {
            active: false // Will not generate the last link
        }
     },
     routes: {
         include: ['/api/posts'],
     }
};


const options = {
    ops: {
        interval: 30000 // reporting interval (30 seconds)
    },
    reporters: {
        myConsoleReporter: [{
            // good-squeeze allows filtering events based on the `good` event options
            // @see https://github.com/hapijs/good/blob/master/API.md#event-types
            module: 'good-squeeze', // https://github.com/hapijs/good-squeeze
            name: 'Squeeze',
            // @example "Log everything"
            args: [{ log: 'debug', error: 'error', response: '*', request: '*', ops: '*' }]
            // @example "Log only request logs with a certain tag":
            // args: [{ request: ['name'] }]
        }, {
            module: 'good-console'
        }, 'stdout'],
        // myFileReporter: [{
        //     module: 'good-squeeze',
        //     name: 'Squeeze',
        //     args: [{ log: 'debug', error: 'error', response: '*', request: '*', ops: '*' }]
        // }, {
        //     module: 'good-squeeze',
        //     name: 'SafeJson'
        // }, {
        //     module: 'good-file',
        //     args: ['./awesome_log']
        // }],
        myHTTPReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: 'debug', error: 'error', response: '*', request: '*', ops: '*' }]
        }, {
            module: 'good-http',
            args: ['http://localhost:3000/api/log', {
                wreck: {
                    headers: { 'x-api-key': 12345 }
                }
            }]
        }]
      }
};

// var validate = function (decoded, request, callback) {

//     console.log(decoded.username, 'pritesh');

//     // do your checks to see if the person is valid
//     // if (!people[decoded.id]) {
//     //   return callback(null, false);
//     // }
//     // else {
//     //   return callback(null, true);
//     // }
// };

server.register([
    require('hapi-auth-jwt'),
    require('vision'),
    {
        register: require('good'),
        options: options
    },
    {
        register: require('hapi-pagination'),
        options: options1
    },
    {
        register:require('./route/plugins/chat')
    }
    ], (err) => {

    //Configuration for rendering templates
    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'route/templates'
    });

  // We're giving the strategy both a name
  // and scheme of 'jwt'
  server.auth.strategy('jwt', 'jwt', {
    key: secret,
    // validateFunc: validate,
    verifyOptions: {
      ignoreExpiration: true,
      algorithms: ['HS256']
    }
  });

  // Look through the routes in
  // all the subdirectories of route
  // and create a new route for each
  glob.sync('route/**/routes/**/*.js', {
    root: __dirname
  }).forEach(file => {
    const route = require(path.join(__dirname, file));
    // console.log(route);
    // reply(route);
    server.route(route);
  });
  // Start the server
  server.start((err) => {
    if (err) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
    // Once started, connect to Mongo through Mongoose

    mongoose.Promise = global.Promise;
    mongoose.connect(dbUrl, {}, (err) => {
      if (err) {
        throw err;
      }
    });
  });
});
