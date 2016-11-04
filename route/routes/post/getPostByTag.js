'use strict';

const bcrypt = require('bcrypt');
const Boom = require('boom');
const Post = require('../../model/Post');
const Tag = require('../../model/Tag');
const createPostSchema = require('../../schemas/createPost');
const secret = require('../../../config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

function getPostByTags(postId) {
    return Post
    .find({_id: postId})
    // Deselect the password and version fields
    .select('-__v')
    .exec((err, Post) => {
        if (err) {
            throw Boom.badRequest(err);
        }

        if(Post.length) {
            return Post;
        }

    });
}


module.exports = {
  method: 'GET',
  path: '/api/tags/{tag_id}/posts',
  config: {
    // Before the route handler runs, verify that the user is unique
    pre: [

    ],
    handler: (request, response) => {

        // Tag
        //     .find({_id: request.params.tag_id})
        //     // Deselect the password and version fields
        //     .select('-__v')
        //     .exec((err, tag) => {
        //         if (err) {
        //             throw Boom.badRequest(err);
        //         }
        //         if (!tag.length) {
        //             throw Boom.notFound('No tags found!');
        //         }

        //         let postList = []; //For holding all the tag objects

        //         for(let i = 0, len = tag[0].post_ids.length; i < len; i++) {

        //             getPostByTags(tag[0].post_ids[i]).then(function(postObject){
        //                 postList.push(postObject[0]);
        //             })

        //         }

        //         setTimeout(function(){
        //             response(postList);
        //         }, 3000);
        //     });

            var tagId = mongoose.Types.ObjectId(request.params.tag_id);

            Post
            .find({tags: tagId})
            .exec((err, posts) => {
                if (err) {
                    throw Boom.badRequest(err);
                }
                if (!posts.length) {
                    throw Boom.notFound('No posts found!');
                }

                response(posts);

            });
    },

    // Add authentication to this route
    // The user must have a scope of `admin`
    // auth: {
    //     strategy: 'jwt'
    // }
  }
}
