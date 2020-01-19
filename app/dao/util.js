'use strict';

const _ = require('lodash');
const elasticsearch = require('elasticsearch');

const config = require('../config');

const es = new elasticsearch.Client({ ...config.es.options });

function getElasticSearchClient() {
  return es;
}

function getIndexName(type) {
  return `${config.es.index}-${type}`;
}

function getParams(type, params) {
  return {
    type,
    ...getParamsWithoutType(type, params)
  };
}

function getParamsWithoutType(type, params) {
  return {
    index: getIndexName(type),
    ...params
  };
}

module.exports = {
  getElasticSearchClient,
  getIndexName,
  getParams
};
