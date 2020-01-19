'use strict';

const sampleFeedA = require('./sampleFeedA');

const search = () => {
  return {
    results: sampleFeedA.rss.channel.item,
    total: sampleFeedA.rss.channel.item.length
  };
};

module.exports = {
  search
};
