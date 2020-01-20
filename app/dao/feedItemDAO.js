'use strict';

const daoUtil = require('./util');
const entityConverter = require('./entityConverter');

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
  const params = ['post', 'like']
    .map(type => daoUtil.getParams(type, query))
    .reduce((acc, { type, index, body }) => {
        return Object.assign(acc, { type: [...acc.type, type], index: [...acc.index, index], body });
      },
      { type: [], index: [] });

  const copyTypeToSource = result => {
    return _.chain(result).get('hits.hits').forEach(i => Object.assign(i._source, { type: i._type })).value();
  };

  return daoUtil.getElasticSearchClient().search(params)
    .tap(result => copyTypeToSource(result))
    .then(entityConverter.forPagination);
};

module.exports = {
  search
};
