'use strict';

const User = require('../model/User');
const Boom = require('boom');
const jwt = require('jsonwebtoken');
const secret = require('../../config');

module.exports = {
  method: 'GET',
  path: '/api/users',
  config: {
    handler: (req, res) => {
      let token = req.headers.authorization.split(' ');
      console.log(jwt.verify(token[1], secret));
      User
        .find()
        // Deselect the password and version fields
        .select('-password -__v')
        .exec((err, users) => {
          if (err) {
            throw Boom.badRequest(err);
          }
          if (!users.length) {
            throw Boom.notFound('No users found!');
          }
          res(users);
        })
    },
    // Add authentication to this route
    // The user must have a scope of `admin`
    auth: {
      strategy: 'jwt',
      scope: ['admin']
    }
  }
}