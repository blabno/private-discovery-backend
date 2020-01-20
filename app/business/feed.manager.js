'use strict';

const feedItemDAO = require('../dao/feedItemDAO');


function create(/* business*/) {
  const search = filter => feedItemDAO.search(filter);

  return {
    search
  };
}


module.exports = {
  create
};
