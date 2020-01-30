'use strict';

const Promise = require('bluebird');

/* eslint-disable no-process-env */
const hostAndPort = process.env.APP_DOMAIN || 'localhost:3000';

module.exports = {
  production: process.env.PRODUCTION || false,
  es: {
    index: process.env.ELASTICSEARCH_INDEX_SUFFIX ? `private-discovery-${process.env.ELASTICSEARCH_INDEX_SUFFIX}` : 'private-discovery',
    options: {
      defer: () => Promise.defer(),
      apiVersion: '6.2',
      host: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
    },
    concurrentRequests: parseInt(process.env.ES_CONCURRENT_REQUESTS, 10) || Infinity
  },
  port: process.env.PORT || 3000,
  swagger: {
    host: hostAndPort
  }
};
