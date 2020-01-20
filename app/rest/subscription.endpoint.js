'use strict';

const Promise = require('bluebird');

const business = require('../business');
const restUtil = require('./util');


module.exports = {
  register(server) {
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
        //TODO this endpoint should be well secured cause if abused it could take down the system
        return Promise.try(() => business(request).getSubscriptionManager().syncAll())
          .then(() => reply.response().code(204))
          .catch(error => restUtil.handleError(error, reply));
      }
    });
  },
  tag: {
    name: 'subscription',
    description: 'Manage subscriptions'
  }
};
