'use strict';

const bcrypt = require('bcrypt');
const Boom = require('boom');
const Post = require('../../model/Post');
const createPostSchema = require('../../schemas/createPost');
const secret = require('../../../config');
const jwt = require('jsonwebtoken');

module.exports = {
  method: 'GET',
  path: '/api/posts',
  config: {
    // Before the route handler runs, verify that the user is unique
    pre: [

    ],
    handler: (request, response) => {

        // response('Hello htetet');
        // let pagesize = 3;
        let token = request.headers.authorization.split(' ');
        let tokenData = jwt.verify(token[1], secret);
        console.log(tokenData);

        Post
            .find({created_by: tokenData.username})
            // .skip(pagesize*(request.query.page - 1))
            // .limit(pagesize)
            // Deselect the password and version fields
            .select('-password -__v')
            .exec((err, posts) => {
                if (err) {
                    throw Boom.badRequest(err);
                }
                if (!posts.length) {
                    return response('No posts found!');
                }
                response(posts);
            });
    },

    // Add authentication to this route
    // The user must have a scope of `admin`
    auth: {
        strategy: 'jwt'
    }
  }
}
