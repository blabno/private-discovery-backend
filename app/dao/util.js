'use strict';

const elasticsearch = require('elasticsearch');

const applicationError = require('../service/applicationError');
const config = require('../config');
const entityConverter = require('./entityConverter');
const scroller = require('./scroll');

const es = new elasticsearch.Client({ ...config.es.options });
const { NotFoundError } = applicationError;

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

function createGetByIdMethod(type) {
  return id => {
    const params = getParams(type, { id });
    return es.get(params).then(entityConverter.fromDB).catch(error => {
      if (404 === error.status) {
        throw new NotFoundError(`${type} with id=${id} not found`);
      } else {
        throw error;
      }
    });
  };
}

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

const createBulkMethod = (type, actionType) => {
  return documents => {
    const action = { _index: getIndexName(type), _type: type };
    const body = documents.reduce((acc, item) => {
      const actionCopy = { ...action };
      const itemCopy = { ...item };
      if (item.id) {
        actionCopy._id = item.id;
        delete itemCopy.id;
      }
      acc.push({ [actionType]: actionCopy });
      acc.push(itemCopy);
      return acc;
    }, []);
    return es.bulk({ body });
  };
};

const createCreateBulkMethod = type => createBulkMethod(type, 'create');

const createSaveBulkMethod = type => createBulkMethod(type, 'index');

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
  createCreateBulkMethod,
  createGetByIdMethod,
  createRemoveMethod,
  createSaveMethod,
  createSaveBulkMethod,
  createScrollMethod,
  getElasticSearchClient,
  getIndexName,
  getParams
};
