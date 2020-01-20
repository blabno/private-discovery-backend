'use strict';

const feedManager = require('./feed.manager');
const postManager = require('./post.manager');
const subscriptionManager = require('./subscription.manager');
const wallManager = require('./wall.manager');

const getter = manager => function () {
  return manager.create(this);
};

module.exports = () => {
  return {
    getFeedManager: getter(feedManager),
    getPostManager: getter(postManager),
    getSubscriptionManager: getter(subscriptionManager),
    getWallManager: getter(wallManager)
  };
};
