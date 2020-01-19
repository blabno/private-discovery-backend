'use strict';

const joi = require('joi');

const commonSchema = require('./common.schema');

const plainSchema = {
  title: joi.string().required(),
  createDate: joi.number().required()
};

const withId = joi.object(commonSchema.withId(plainSchema)).label('post');

module.exports = {
  withId
};
