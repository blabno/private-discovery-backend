'use strict';

const Promise = require('bluebird');

const config = require('../app/config.js');
const daoUtil = require('../app/dao/util');
const data = require('./data.json');
const mapping = require('./mapping.json');
const seeder = require('./seeder');

const promiseMapOptions = { concurrency: config.es.concurrentRequests };

async function processType(type) {
  const index = `${daoUtil.getIndexName(type)}-001`;
  await seeder.removeIndexesByType(type);
  await seeder.createIndex(index, type);
  await seeder.assignAlias(null, index, type);
  await seeder.seedData({ [type]: data[type] });
  console.info(`Type '${type}' seeded`);
}

(async () => {
  try {
    await Promise.map(Object.keys(mapping), processType, promiseMapOptions);
    console.info('Seed complete');
  } catch (error) {
    console.error(error.stack || error);
  }
})();
