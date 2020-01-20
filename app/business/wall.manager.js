'use strict';

const wallItemDAO = require('../dao/wallItemDAO');


function create(/* business*/) {
  const markRead = id => wallItemDAO.markRead(id);

  const search = filter => wallItemDAO.search(filter);

  return {
    markRead,
    search
  };
}


module.exports = {
  create
};
