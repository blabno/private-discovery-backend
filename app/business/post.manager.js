'use strict';

const postDAO = require('../dao/postDAO');


function create(/* business*/) {
  const search = filter => postDAO.search(filter);

  return {
    search
  };
}


module.exports = {
  create
};
