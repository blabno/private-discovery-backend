'use strict';

const joi = require('joi');

const commonSchema = require('./common.schema');

const plainSchema = {
  comment: joi.string(),
  createDate: joi.number().required(),
  link: joi.string().required(),
  title: joi.string(),
  type: joi.string().valid('like', 'share', 'post').required()
};

const withId = joi.object(commonSchema.withId(plainSchema)).label('feedItem');

module.exports = {
  withId
};
