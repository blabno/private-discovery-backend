'use strict';

const wallItemDAO = require('../dao/wallItemDAO');


function create(/* business*/) {
  const markNotRead = id => wallItemDAO.markNotRead(id);

  const markRead = id => wallItemDAO.markRead(id);

  const search = filter => wallItemDAO.search(filter);

  return {
    markNotRead,
    markRead,
    search
  };
}


module.exports = {
  create
};
