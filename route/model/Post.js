
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postModel = new Schema({
	title: { type: String, required: true, index: { unique: true } },
	description: { type: String, required: true, index: { unique: false } },
	created_by: { type: String, required: true },
	tags: { type: Array, required: false }
});

module.exports = mongoose.model('Post', postModel);
