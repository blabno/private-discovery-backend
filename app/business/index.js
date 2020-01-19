'use strict';

const postManager = require('./post.manager');

const getter = manager => function () {
  return manager.create(this);
};

module.exports = () => {
  return {
    getPostManager: getter(postManager)
  };
};
