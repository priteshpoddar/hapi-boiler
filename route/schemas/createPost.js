'use strict';

const Joi = require('joi');

const createPostSchema = Joi.object({
	title: Joi.string().alphanum().min(2).max(100).required(),
	description: Joi.string().required(),
	tags: Joi.array().optional()
});

module.exports = createPostSchema;