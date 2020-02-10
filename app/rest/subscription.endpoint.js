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
      path: '/subscriptions',
      config: {
        description: 'Search subscriptions',
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
                  results: joi.array().required().items(schema.subscription.withId).label('subscriptions'),
                  total: joi.number().integer().min(0).required()
                }).label('searchSubscriptionsResponse')
              }

            }
          }
        }
      },
      handler(request, reply) {
        return Promise.try(() => business(request).getSubscriptionManager().search(request.query))
          .catch(error => restUtil.handleError(error, reply));
      }
    });
    server.route({
      method: 'POST',
      path: '/subscriptions/sync',
      config: {
        description: 'Fetch subscribed feeds',
        tags: ['api'],
        plugins: {
          'hapi-swagger': {
            responses: {
              204: {}
            }
          }
        }
      },
      handler(request, reply) {
        // TODO this endpoint should be well secured cause if abused it could take down the system
        return Promise.try(() => business(request).getSubscriptionManager().syncAll())
          .then(() => reply.response().code(204))
          .catch(error => restUtil.handleError(error, reply));
      }
    });
  },
  tag: {
    name: 'subscriptions',
    description: 'Manage subscriptions'
  }
};
