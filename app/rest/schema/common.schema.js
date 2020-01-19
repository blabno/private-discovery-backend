'use strict';

const joi = require('joi');

function withId(schema) {
  return Object.assign({ id: joi.string().required() }, schema);
}

module.exports = {
  withId
};
