'use strict';

const joi = require('joi');

const commonSchema = require('./common.schema');

const plainSchema = {
  createDate: joi.number().required(),
  syncDate: joi.number().required(),
  format: joi.string().required(),
  name: joi.string().required(),
  url: joi.string().required(),
};

const withId = joi.object(commonSchema.withId(plainSchema)).label('subscription');

module.exports = {
  withId
};
