'use strict';

const _ = require('lodash');

const { fetchFeed } = require('../service/feedFetcher');
const subscriptionDAO = require('../dao/subscriptionDAO');

let syncAllInProgress = false;

function create(/* business*/) {
  const search = filter => subscriptionDAO.search(filter);

  const sync = async subscription => {
    try {
      // TODO verify if bulk was successful or log the errors
      await fetchFeed(subscription);
    } catch (e) {
      console.error(`Unable to sync subscription ${subscription.id} ${subscription.format} ${subscription.url}`, e);
    }
  };

  const syncAll = async () => {
    // TODO save sync data as document in db and return it so that client can see the status
    if (syncAllInProgress) {
      return;
    }
    syncAllInProgress = true;
    try {
      await subscriptionDAO.scrollAll(bulk => _.chain(bulk).first().thru(sync).value(), { bulkSize: 1 });
    } finally {
      syncAllInProgress = false;
    }
  };

  return {
    search,
    sync,
    syncAll
  };
}


module.exports = {
  create
};
