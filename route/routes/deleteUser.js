'use strict';

const User = require('../model/User');
const Boom = require('boom');

module.exports = {
    method: 'DELETE',
    path: '/api/users/{id}',
    config: {
        handler: (req, res) => {
            User
            .remove({
              _id: req.params.id
            }, (err, result) => {
                 if (err) {
                    return res(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (result.n === 0) {
                    return res(Boom.notFound());
                }

                res('Deleted Successfully').code(204);
            });
        },
        // Add authentication to this route
        // The user must have a scope of `admin`
        auth: {
            strategy: 'jwt',
            scope: ['admin']
        }
      }
}