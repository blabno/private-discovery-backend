'use strict';

const $http = require('http-as-promised');

const timeout = parseInt(process.env.SYNC_INTERVAL, 10) || 60000;
const baseUrl = process.env.API_URL || 'http://localhost:3000';
const sync = () => $http.post(`${baseUrl}/subscriptions/sync`);
setTimeout(() => {
  sync();
  setInterval(sync, timeout);
}, 5000);
