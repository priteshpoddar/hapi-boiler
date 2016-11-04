'use strict';

const bcrypt = require('bcrypt');
const Boom = require('boom');
const Post = require('../../model/Post');
const createPostSchema = require('../../schemas/createPost');
const secret = require('../../../config');
const jwt = require('jsonwebtoken');

module.exports = {
  method: 'GET',
  path: '/api/posts/{id}',
  config: {
    // Before the route handler runs, verify that the user is unique
    pre: [

    ],
    handler: (request, response) => {

        // response('Hello htetet');

        // let token = request.headers.authorization.split(' ');
        // let tokenData = jwt.verify(token[1], secret);
        // console.log(tokenData);

        Post
            .find({_id: request.params.id})
            // Deselect the password and version fields
            .select('-password -__v')
            .exec((err, post) => {
                if (err) {
                    throw Boom.badRequest(err);
                }
                if (!post.length) {
                    throw Boom.notFound('No posts found!');
                }
                response(post);
            });
    },

    // Add authentication to this route
    // The user must have a scope of `admin`
    auth: {
        strategy: 'jwt'
    }
  }
}
