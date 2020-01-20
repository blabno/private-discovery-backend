'use strict';

const $http = require('http-as-promised');

(async () => await $http.post('http://localhost:3000/subscriptions/sync'))();
