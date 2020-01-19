'use strict';

const daoUtil = require('./util');
const entityConverter = require('./entityConverter');

const type = 'post';

function search(filter) {
  const must = [];
  const query = {
    body: {
      query: {
        bool: {
          must
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
}

module.exports = {
  search
};
