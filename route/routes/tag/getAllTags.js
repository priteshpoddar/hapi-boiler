'use strict';

const bcrypt = require('bcrypt');
const Boom = require('boom');
const Tag = require('../../model/Tag');
const secret = require('../../../config');
const jwt = require('jsonwebtoken');

module.exports = {
  method: 'GET',
  path: '/api/tags',
  config: {
    // Before the route handler runs, verify that the user is unique
    pre: [

    ],
    handler: (request, response) => {

        // response('Hello htetet');

        // let token = request.headers.authorization.split(' ');
        // let tokenData = jwt.verify(token[1], secret);
        // console.log(tokenData);

        Tag
            // .find({created_by: tokenData.username})
            .find()
            // Deselect the password and version fields
            .select('-password -__v')
            .exec((err, tags) => {
                if (err) {
                    throw Boom.badRequest(err);
                }
                if (!tags.length) {
                    throw Boom.notFound('No tags found!');
                }
                response(tags);
            });
    },

    // Add authentication to this route
    // auth: {
    //     strategy: 'jwt'
    // }
  }
}
