'use strict';

const daoUtil = require('./util');
const entityConverter = require('./entityConverter');

const type = 'feed-item';

const search = (filter = {}) => {
  const must = [];
  const mustNot = [];
  if (!filter.includeUnread) {
    mustNot.push({ term: { read: false } });
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
  saveBulk: daoUtil.createSaveBulkMethod(type),
  search
};
