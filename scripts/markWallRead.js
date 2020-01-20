'use strict';

const $http = require('http-as-promised');
const Promise = require('bluebird');

(async () => {
  const size = 10;
  let from = 0;
  let wall;
  do {
    wall = await $http.get(`http://localhost:3000/wall?size=${size}&from=${from}`, { json: true, resolve: 'body' });
    await Promise.map(wall.results, item => $http.put(`http://localhost:3000/wall/${item.id}/mark-read`));
    from += size;
  } while (wall.results.length);
})();
