'use strict';

const joi = require('joi');
const Promise = require('bluebird');

const business = require('../business');
const restUtil = require('./util');
const schema = require('./joi.schema');


module.exports = {
  register(server) {
    server.route({
      method: 'GET',
      path: '/wall',
      config: {
        description: 'Read your wall',
        tags: ['api'],
        validate: {
          query: {
            q: joi.string(),
            includeUnread: joi.boolean().default(false),
            size: joi.number().integer().min(0).max(100),
            from: joi.number().integer().min(0)
          }
        },
        plugins: {
          'hapi-swagger': {
            responses: {
              200: {
                schema: joi.object({
                  results: joi.array().required().items(schema.wallItem.withId).label('wallItems'),
                  total: joi.number().integer().min(0).required()
                }).label('searchWallResponse')
              }

            }
          }
        }
      },
      handler(request, reply) {
        return Promise.try(() => business(request).getWallManager().search(request.query))
          .catch(error => restUtil.handleError(error, reply));
      }
    });
    server.route({
      method: 'PUT',
      path: '/wall/{id}/mark-read',
      config: {
        description: 'Mark wall item as already seen',
        tags: ['api'],
        validate: {
          params: {
            id: joi.string().required()
          }
        },
        plugins: {
          'hapi-swagger': {
            responses: {
              204: {}
            }
          }
        }
      },
      handler(request, reply) {
        return Promise.try(() => business(request).getWallManager().markRead(request.params.id))
          .then(() => reply.response().code(204))
          .catch(error => restUtil.handleError(error, reply));
      }
    });
    server.route({
      method: 'PUT',
      path: '/wall/{id}/mark-not-read',
      config: {
        description: 'Mark wall item as not yet seen',
        tags: ['api'],
        validate: {
          params: {
            id: joi.string().required()
          }
        },
        plugins: {
          'hapi-swagger': {
            responses: {
              204: {}
            }
          }
        }
      },
      handler(request, reply) {
        return Promise.try(() => business(request).getWallManager().markNotRead(request.params.id))
          .then(() => reply.response().code(204))
          .catch(error => restUtil.handleError(error, reply));
      }
    });
    server.route({
      method: 'POST',
      path: '/wall/{id}/like',
      config: {
        description: 'Mark wall item as liked',
        tags: ['api'],
        validate: {
          params: {
            id: joi.string().required()
          }
        },
        plugins: {
          'hapi-swagger': {
            responses: {
              204: {}
            }
          }
        }
      },
      handler(request, reply) {
        return Promise.try(() => business(request).getWallManager().like(request.params.id))
          .then(() => reply.response().code(204))
          .catch(error => restUtil.handleError(error, reply));
      }
    });
    server.route({
      method: 'POST',
      path: '/wall/{id}/unlike',
      config: {
        description: 'Unmark wall item as liked',
        tags: ['api'],
        validate: {
          params: {
            id: joi.string().required()
          }
        },
        plugins: {
          'hapi-swagger': {
            responses: {
              204: {}
            }
          }
        }
      },
      handler(request, reply) {
        return Promise.try(() => business(request).getWallManager().unlike(request.params.id))
          .then(() => reply.response().code(204))
          .catch(error => restUtil.handleError(error, reply));
      }
    });
  },
  tag: {
    name: 'wall',
    description: 'Manage wall'
  }
};
