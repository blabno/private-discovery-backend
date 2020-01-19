'use strict';

const _ = require('lodash');
const applicationError = require('../service/applicationError');

const buildErrorResponse = (reply, error, codeOverride) => {
  const payload = error.payload || error.message;
  const payloadAsObject = _.isObject(payload) ? payload : { error: payload };
  return reply.response(payloadAsObject).code(codeOverride || error.code).message(error.message);
};

module.exports = {
  handleError(error, reply, errorMapping) {
    const code = errorMapping && errorMapping[error && error.name];
    if (code) {
      return buildErrorResponse(reply, error, code);
    }

    if (applicationError.isApplicationException(error)) {
      return buildErrorResponse(reply, error);
    }
    console.error(error);
    return reply.response().code(500);
  }
};
