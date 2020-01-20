'use strict';

const daoUtil = require('./util');

const type = 'like';

module.exports = {
  remove: daoUtil.createRemoveMethod(type),
  save: daoUtil.createSaveMethod(type)
};
