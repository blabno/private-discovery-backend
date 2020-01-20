'use strict';

const applicationError = require('../service/applicationError');
const daoUtil = require('./util');
const entityConverter = require('./entityConverter');

const { NotFoundError } = applicationError;

const type = 'feed-item';

const markRead = id => {
  const params = daoUtil.getParams(type, { id, body: { doc: { read: true } } });
  return daoUtil.getElasticSearchClient()
    .update(params)
    .then(() => null)
    .catch(error => {
      if (404 === error.status) {
        throw new NotFoundError(`${type} with id=${id} not found`);
      } else {
        throw error;
      }
    });
};

const search = (filter = {}) => {
  const must = [];
  const mustNot = [];
  if (!filter.includeUnread) {
    mustNot.push({ term: { read: true } });
  }
  const query = {
    body: {
      query: {
        bool: {
          must,
          must_not: mustNot
        }
      },
      from: filter.from,
      size: filter.size,
      sort: [
        { createDate: { order: 'desc' } }
      ]
    }
  };
  if (filter.q) {
    must.push({
      simple_query_string: {
        query: filter.q,
        fields: ['title'],
        default_operator: 'and'
      }
    });
  }

  const params = daoUtil.getParams(type, query);
  return daoUtil.getElasticSearchClient().search(params).then(entityConverter.forPagination);
};

module.exports = {
  markRead,
  saveBulk: daoUtil.createSaveBulkMethod(type),
  search
};
