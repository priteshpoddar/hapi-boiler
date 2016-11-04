'use strict';

const User = require('../model/User');
const Boom = require('boom');
const Joi = require('joi');
const bcrypt = require('bcrypt');


module.exports = {
    method: 'PATCH',
    path: '/api/users/{id}',
    config: {
        // Check the user's password against the DB
        pre: [
            // { method: verifyCredentials, assign: 'user' }
        ],
        handler: (request, response) => {

            User.findOne({
                _id: request.params.id
            }, (err, user) => {
                if (err) {
                    throw Boom.badRequest(err);
                }

                if (!user) {
                    throw Boom.notFound();
                }

                if (user) {
                    bcrypt.compare(request.payload.password, user.password, (err, isValid) => {
                        if (isValid) {
                            if(request.payload.email)
                                user.email = request.payload.email;
                            if(request.payload.username)
                                user.username = request.payload.username;
                            if(request.payload.newpassword)
                                user.password = request.payload.newpassword;

                            user.save((err, user) => {
                                if (err) {
                                    throw Boom.badRequest(err);
                                }
                                // If the user is saved successfully
                                response(user);
                            });

                        }
                        else {
                          response(Boom.badRequest('Incorrect password!'));
                        }
                    });
                } else {
                    response(Boom.badRequest('Incorrect username or email!'));
                }

            });
        },
        validate: {
            payload: Joi.object({
                email: Joi.string().min(10).max(50).optional(),
                username: Joi.string().min(10).max(50).optional(),
                password: Joi.string().required(),
                newpassword: Joi.string().optional()
            }).required().min(1)
        },

        // Add authentication to this route
        // The user must have a scope of `admin`
        auth: {
            strategy: 'jwt'
        }
    }
}