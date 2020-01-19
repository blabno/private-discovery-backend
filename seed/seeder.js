'use strict';

const elasticsearch = require('elasticsearch');
const Promise = require('bluebird');

const config = require('../app/config.js');
const daoUtil = require('../app/dao/util');
const defaultData = require('./data.json');
const mapping = require('./mapping.json');
const settings = require('./settings.json');

const es = new elasticsearch.Client(config.es.options);
const promiseMapOptions = { concurrency: config.es.concurrentRequests };

async function assignAlias(oldIndex, newIndex, type) {
  const alias = daoUtil.getIndexName(type);
  const exists = await es.indices.existsAlias({ index: oldIndex, name: alias });
  if (exists) {
    await es.indices.deleteAlias({ index: oldIndex, name: alias });
  }
  await es.indices.putAlias({ index: newIndex, name: alias });
}

async function createIndex(index, type) {
  await es.indices.create({ index, body: { settings, mappings: { [type]: mapping[type] } } });
}

async function copyData(oldIndex, newIndex, type) {
  async function saveBulk(documents) {
    const action = { _index: newIndex, _type: type };
    const body = documents.reduce((acc, item) => {
      acc.push({ index: { ...action, _id: item._id } });
      acc.push(item._source);
      return acc;
    }, []);
    const result = await es.bulk({ body });
    result.items.forEach(item => {
      const error = item.index.error;
      if (error) {
        throw new Error(`[${error.type}] ${error.reason}`);
      }
    });
  }

  async function scroll(response) {
    if (!response.hits.hits.length) {
      return;
    }
    await saveBulk(response.hits.hits);
    await scroll(await es.scroll({
      scrollId: response._scroll_id,
      scroll: '1m'
    }));
  }

  const searchResult = await es.search({
    index: oldIndex,
    scroll: '1m',
    size: 1000
  });

  await Promise.resolve(scroll(searchResult)).finally(() => es.clearScroll({ scrollId: searchResult._scroll_id }));
}

async function getAllIndexes() {
  return await es.indices.get({ index: '_all' });
}

async function getIndexesByType(type) {
  const indexes = await getAllIndexes();
  const indexName = daoUtil.getIndexName(type);
  return Object.keys(indexes).filter(index => Object.keys(indexes[index].aliases).includes(indexName));
}

async function getMapping(index) {
  return (await es.indices.get({ index }))[index].mappings;
}

async function refreshIndexes() {
  const indexes = Object.keys(await getAllIndexes());
  return es.indices.refresh({ index: indexes });
}

async function removeIndex(index) {
  await es.indices.delete({ index });
}

async function removeIndexesByType(type) {
  const indexes = await getIndexesByType(type);
  await Promise.map(indexes, index => removeIndex(index), promiseMapOptions);
}

async function seedData(data = defaultData) {
  await Promise.map(Object.keys(data), type => {
    return Promise.map(data[type], async record => {
      const body = { ...record };
      delete body.id;
      return await es.index(daoUtil.getParams(type, { id: record.id, body }));
    }, promiseMapOptions);
  }, promiseMapOptions);
}

async function seedFixture(fixture) {
  await Promise.map(Object.keys(await getAllIndexes()), type => removeIndex(type), promiseMapOptions);
  await Promise.map(Object.keys(fixture), async type => {
    const index = `${daoUtil.getIndexName(type)}-001`;
    await createIndex(index, type);
    await assignAlias(null, index, type);
    await seedData({ [type]: fixture[type] });
  }, promiseMapOptions);
  await refreshIndexes();
}

module.exports = {
  assignAlias,
  createIndex,
  copyData,
  getIndexesByType,
  getMapping,
  removeIndex,
  removeIndexesByType,
  seedData,
  seedFixture
};
