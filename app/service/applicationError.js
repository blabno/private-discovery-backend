'use strict';

class ApplicationError extends Error {
  constructor(message, code, payload) {
    super(message);
    this.code = code;
    this.name = this.constructor.name;
    this.payload = payload;
  }
}

class BadRequestError extends ApplicationError {
  constructor(message = 'BAD_REQUEST') {
    super(message, 400);
  }
}

class ForbiddenError extends ApplicationError {
  constructor(message = 'FORBIDDEN') {
    super(message, 403);
  }
}

class NotFoundError extends ApplicationError {
  constructor(message = 'NOT_FOUND') {
    super(message, 404);
  }
}

class UnauthorizedError extends ApplicationError {
  constructor(message = 'UNAUTHORIZED') {
    super(message, 401);
  }
}

function isApplicationException(e) {
  return e instanceof ApplicationError;
}

module.exports = {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,

  isApplicationException
};
