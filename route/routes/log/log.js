'use strict';

// const bcrypt = require('bcrypt');
const Boom = require('boom');
// const Tag = require('../../model/Tag');
// const createTagSchema = require('../../schemas/createTag');
// const secret = require('../../../config');
// const jwt = require('jsonwebtoken');

module.exports = {
  method: 'GET',
  path: '/',
  config: {
    // Before the route handler runs, verify that the user is unique
    pre: [

    ],
    handler: (request, response) => {

        // response(request);

        response.view('index');

        // let token = request.headers.authorization.split(' ');
        // let tokenData = jwt.verify(token[1], secret);

        // let tag = new Tag();
        // tag.tag_name = request.payload.tag_name;

        // tag.save((err, tag) => {
        //     if (err) {
        //         throw Boom.badRequest(err);
        //     }

        //     response(tag);
        // });
    },

    // Validate the payload against the Joi schema
    // validate: {
    //     payload: createTagSchema
    // },

    // Add authentication to this route
    // The user must have a scope of `admin`
    // auth: {
    //     strategy: 'jwt'
    // }
  }
}
