'use strict';

const Joi = require('joi');

const createTagSchema = Joi.object({
	tag_name: Joi.string().optional()
});

module.exports = createTagSchema;