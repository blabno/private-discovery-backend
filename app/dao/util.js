'use strict';

const elasticsearch = require('elasticsearch');

const config = require('../config');

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

module.exports = {
  createSaveBulkMethod,
  getElasticSearchClient,
  getIndexName,
  getParams
};
