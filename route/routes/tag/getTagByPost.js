'use strict';

const bcrypt = require('bcrypt');
const Boom = require('boom');
const Tag = require('../../model/Tag');
const Post = require('../../model/Post');
const secret = require('../../../config');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb');
const mongoose = require('mongoose');


//Get Tag by Tag ID
// function getPostTags(tagId) {

//     return Tag
//     .find({_id: tagId})
//     // Deselect the password and version fields
//     .select('-__v -post_ids')
//     .exec((err, tag) => {
//         if (err) {
//             throw Boom.badRequest(err);
//         }

//         if(tag.length) {
//             return tag;
//         }

//     });

// }

module.exports = {
  method: 'GET',
  path: '/api/posts/{post_id}/tags',
  config: {
    // Before the route handler runs, verify that the user is unique
    pre: [

    ],
    handler: (request, response) => {

        // Post
        //     .find({_id: request.params.post_id})
        //     // Deselect the password and version fields
        //     .select('-password -__v')
        //     .exec((err, post) => {
        //         if (err) {
        //             throw Boom.badRequest(err);
        //         }
        //         if (!post.length) {
        //             throw Boom.notFound('No posts found!');
        //         }

        //         let tagList = []; //For holding all the tag objects

        //         for(let i = 0, len = post[0].tags.length; i < len; i++) {

        //             getPostTags(post[0].tags[i]).then(function(tagObject){
        //                 tagList.push(tagObject[0]);
        //             })

        //         }

        //         setTimeout(function(){
        //             response(tagList);
        //         }, 3000);
        //     });

        var postId = mongoose.Types.ObjectId(request.params.post_id);

        Tag
            .find({post_ids: postId})
            .exec((err, tags) => {
                if (err) {
                    throw Boom.badRequest(err);
                }
                if (!tags.length) {
                    throw Boom.notFound('No posts found!');
                }

                response(tags);

            });


    }

    // Add authentication to this route
    // auth: {
    //     strategy: 'jwt'
    // }
  }
}
