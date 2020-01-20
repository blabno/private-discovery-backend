'use strict';

const daoUtil = require('./util');
const entityConverter = require('./entityConverter');

const type = 'subscription';

const search = filter => {
  const query = {
    body: {
      from: filter.from,
      size: filter.size,
      sort: [
        { syncDate: { order: 'asc' } }
      ]
    }
  };

  const params = daoUtil.getParams(type, query);
  return daoUtil.getElasticSearchClient().search(params).then(entityConverter.forPagination);
};

const genericScroll = daoUtil.createScrollMethod(type);

const scrollAll = (callback, { bulkSize = 100 } = {}) => genericScroll({ match_all: {} }, callback, { size: bulkSize });

module.exports = {
  scrollAll,
  search
};
