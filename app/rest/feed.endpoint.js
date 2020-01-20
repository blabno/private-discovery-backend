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
      path: '/feed',
      config: {
        description: 'Read what you have published or shared',
        tags: ['api'],
        validate: {
          query: {
            q: joi.string(),
            size: joi.number().integer().min(0).max(100),
            from: joi.number().integer().min(0)
          }
        },
        plugins: {
          'hapi-swagger': {
            responses: {
              200: {
                schema: joi.object({
                  results: joi.array().required().items(schema.feedItem.withId).label('feedItems'),
                  total: joi.number().integer().min(0).required()
                }).label('searchFeedResponse')
              }

            }
          }
        }
      },
      handler(request, reply) {
        return Promise.try(() => business(request).getFeedManager().search(request.query))
          .catch(error => restUtil.handleError(error, reply));
      }
    });
  },
  tag: {
    name: 'feed',
    description: 'Manage feed'
  }
};
