'use strict';

const feedItemDAO = require('../dao/feedItemDAO');


function create(/* business*/) {
  const markRead = id => feedItemDAO.markRead(id);

  const search = filter => feedItemDAO.search(filter);

  return {
    markRead,
    search
  };
}


module.exports = {
  create
};
