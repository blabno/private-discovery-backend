'use strict';

const daoUtil = require('./util');
const entityConverter = require('./entityConverter');

const type = 'subscription';

const search = filter => {
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
        { 'name.raw': { order: 'asc' } }
      ]
    }
  };
  if (filter.q) {
    must.push({
      simple_query_string: {
        query: filter.q,
        fields: ['name'],
        default_operator: 'and'
      }
    });
  }
  const params = daoUtil.getParams(type, query);
  return daoUtil.getElasticSearchClient().search(params).then(entityConverter.forPagination);
};

const genericScroll = daoUtil.createScrollMethod(type);

const scrollAll = (callback, { bulkSize = 100 } = {}) => genericScroll({ match_all: {} }, callback, { size: bulkSize });

module.exports = {
  scrollAll,
  search
};
