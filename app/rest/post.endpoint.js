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
      path: '/posts',
      config: {
        description: 'Get posts in the feed',
        tags: ['api'],
        plugins: {
          'hapi-swagger': {
            responses: {
              200: {
                schema: joi.object({
                  results: joi.array().required().items(schema.post.withId).label('posts'),
                  total: joi.number().integer().min(0).required()
                }).label('searchPostsResponse')
              }
            }
          }
        }
      },
      handler(request, reply) {
        return Promise.try(() => business(request).getPostManager().search())
          .catch(error => restUtil.handleError(error, reply));
      }
    });
  },
  tag: {
    name: 'post',
    description: 'Manage posts'
  }
};
