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
              204: {
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
  },
  tag: {
    name: 'wall',
    description: 'Manage wall'
  }
};