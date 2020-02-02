'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

const config = require('../app/config.js');
const daoUtil = require('../app/dao/util');
const mapping = require('../seed/mapping.json');
const seeder = require('../seed/seeder');

const promiseMapOptions = { concurrency: config.es.concurrentRequests };

function getOldestIndex(indices) {
  return indices.sort().slice(-1)[0];
}

function getOldestVersion(indices) {
  const oldestIndex = getOldestIndex(indices);
  if (oldestIndex) {
    return Number(oldestIndex.split('-').slice(-1)[0]);
  }
  return null;
}

async function isMappingUnchanged(oldIndex, type) {
  const oldMapping = (await seeder.getMapping(oldIndex))[type];
  const newMapping = mapping[type];
  return _.isEqual(oldMapping, newMapping);
}

async function processType(type) {
  const indices = await seeder.getIndexesByType(type);
  const oldIndex = getOldestIndex(indices);
  if (oldIndex && await isMappingUnchanged(oldIndex, type)) {
    return;
  }
  const version = getOldestVersion(indices);
  const newIndex = version ? `${daoUtil.getIndexName(type)}-${_.padStart(version + 1, 3, 0)}` : `${daoUtil.getIndexName(
    type)}-001`;
  await seeder.createIndex(newIndex, type);
  if (oldIndex) {
    await seeder.copyData(oldIndex, newIndex, type);
    await seeder.removeIndex(oldIndex);
  }
  await seeder.assignAlias(oldIndex, newIndex, type);
  console.info(`Type '${type}' migrated`);
}

(async () => {
  try {
    await Promise.map(Object.keys(mapping), processType, promiseMapOptions);
    console.info('Migration complete');
  } catch (error) {
    console.error(error.stack || error);
  }
})();
