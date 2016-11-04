
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagModel = new Schema({
	tag_name: { type: String, required: true, index: { unique: true } },
	post_ids: { type: Array, required: false }
});

module.exports = mongoose.model('Tag', tagModel);
