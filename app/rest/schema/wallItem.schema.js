'use strict';

const joi = require('joi');

const commonSchema = require('./common.schema');

const plainSchema = {
  createDate: joi.number().required(),
  link: joi.string().required(),
  read: joi.boolean(),
  title: joi.string().required()
};

const withId = joi.object(commonSchema.withId(plainSchema)).label('wallItem');

module.exports = {
  withId
};
