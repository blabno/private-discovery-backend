'use strict';

const daoUtil = require('./util');

const type = 'feed-item';

module.exports = {
  saveBulk: daoUtil.createSaveBulkMethod(type)
};
