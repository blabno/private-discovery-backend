'use strict';

const elasticsearch = require('elasticsearch');

const config = require('../config');
const scroller = require('./scroll');

const es = new elasticsearch.Client({ ...config.es.options });

const getElasticSearchClient = () => es;

const getIndexName = type => `${config.es.index}-${type}`;

const getParamsWithoutType = (type, params) => {
  return {
    index: getIndexName(type),
    ...params
  };
};

const getParams = (type, params) => {
  return {
    type,
    ...getParamsWithoutType(type, params)
  };
};

function createRemoveMethod(type) {
  return id => {
    const params = getParams(type, { id, refresh: true });
    return es.delete(params).then(() => null);
  };
}

function createSaveMethod(type) {
  return document => {
    const id = document.id;
    const copy = { ...document };
    delete copy.id;
    const params = getParams(type, { id, body: copy, refresh: true });
    return es.index(params).then(result => Object.assign(copy, { id: result._id }));
  };
}

const createSaveBulkMethod = type => {
  return documents => {
    const action = { _index: getIndexName(type), _type: type };
    const body = documents.reduce((acc, item) => {
      const actionCopy = { ...action };
      const itemCopy = { ...item };
      if (item.id) {
        actionCopy._id = item.id;
        delete itemCopy.id;
      }
      acc.push({ index: actionCopy });
      acc.push(itemCopy);
      return acc;
    }, []);
    return es.bulk({ body });
  };
};

const createScrollMethod = type => {
  return (query, callback, settings) => {
    const scrollerQuery = {
      body: {
        query
      }
    };
    const params = getParams(type, scrollerQuery);
    return scroller(es, params, settings, callback);
  };
};

module.exports = {
  createRemoveMethod,
  createSaveMethod,
  createSaveBulkMethod,
  createScrollMethod,
  getElasticSearchClient,
  getIndexName,
  getParams
};
