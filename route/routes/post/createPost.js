'use strict';

const bcrypt = require('bcrypt');
const Boom = require('boom');
const Post = require('../../model/Post');
const Tag = require('../../model/Tag');
const createPostSchema = require('../../schemas/createPost');
const secret = require('../../../config');
const jwt = require('jsonwebtoken');

function getTagIds(tagName) {

    return Tag
    .find({tag_name: tagName})
    .exec((err, tag) => {
        if (err) {
            throw Boom.badRequest(err);
        }
        if(tag.length) {
            // tagIds.push(tag);
            // console.log(tag);
            return tag;
        }

        //If no tag is found the create a new Tag
        if (!tag.length) {
            let tag = new Tag();
            tag.tag_name = tagName;

            tag.save((err, tag) => {
                if (err) {
                    throw Boom.badRequest(err);
                }

                return tag;

                // tagIds.push(tag);
                // console.log(tag);

            });
        }
    });
}

function storePostIds(post) {

    console.log(post, 'pritesh');


    for(let i = 0, len = post.tags.length; i < len; i++) {

        Tag
        .find({_id: post.tags[i]})
        .exec((err, tag) => {
            if (err) {
                throw Boom.badRequest(err);
            }

            if(tag.length) {
                tag[0].post_ids.push(post._id);
                tag[0].save((err, tag) => {
                    if (err) {
                        throw Boom.badRequest(err);
                    }

                    // response(tag);
                });
            }

        });

    }

}


module.exports = {
  method: 'POST',
  path: '/api/posts',
  config: {
    // Before the route handler runs, verify that the user is unique
    pre: [

    ],
    handler: (request, response) => {

        console.log(request.auth, 'ooooo');

        let token = request.headers.authorization.split(' ');
        let tokenData = jwt.verify(token[1], secret);

        let post = new Post();
        post.title = request.payload.title;
        post.description = request.payload.description;
        post.created_by = tokenData.username;
        post.tags = [];

        //Search for ID of each Tag in the Payload
        for(let i = 0, len = request.payload.tags.length; i < len; i++) {

            getTagIds(request.payload.tags[i]).then((tagObject) => {

                post.tags.push(tagObject[0]._id);
                console.log(post.tags, 'pritesh');
            });

        }

        setTimeout(function(){

            post.save((err, post) => {
                if (err) {
                    throw Boom.badRequest(err);
                }

                storePostIds(post);

                response(post);
            });
        }, 3000);

    },
    // Validate the payload against the Joi schema
    validate: {
        payload: createPostSchema
    },

    // Add authentication to this route
    // The user must have a scope of `admin`
    auth: {
        strategy: 'jwt'
    }
  }
}
