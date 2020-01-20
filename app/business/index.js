'use strict';

const postManager = require('./post.manager');
const subscriptionManager = require('./subscription.manager');

const getter = manager => function () {
  return manager.create(this);
};

module.exports = () => {
  return {
    getPostManager: getter(postManager),
    getSubscriptionManager: getter(subscriptionManager)
  };
};
