'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

const entityConverter = require('./entityConverter');


const toParams = settingsArg => {
  const settings = settingsArg || {};
  return {
    scroll: settings.timeout || '1m',
    size: settings.size || 100,
    fields: settings.fields
  };
};

const execute = (es, paramsArg, settingsArg, callback) => {
  const settings = settingsArg || {};

  function getMoreUntilDone(result) {
    if (!result.hits.hits.length) {
      return Promise.resolve(result.hits.total);
    }
    return Promise.resolve().then(() => {
      const hits = entityConverter.fromDB(result);
      return callback(hits, result.hits.total);
    }).then(() => {
      return es.scroll({
        scrollId: result._scroll_id,
        scroll: settings.timeout || '1m'
      });
    }).then(getMoreUntilDone);
  }

  const params = _.extend(paramsArg, toParams(settings));
  return es.search(params).then(result => {
    return getMoreUntilDone(result).finally(() => {
      return es.clearScroll({
        scrollId: result._scroll_id
      });
    });
  });
};


module.exports = execute;
