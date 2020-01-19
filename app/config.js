'use strict';

/* eslint-disable no-process-env */
const hostAndPort = process.env.APP_DOMAIN || 'localhost:3000';

module.exports = {
  production: process.env.PRODUCTION || false,
  port: process.env.PORT || 3000,
  swagger: {
    host: hostAndPort
  }
};
