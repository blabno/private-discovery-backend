'use strict';

const postDAO = require('../dao/postDAO');


function create(/* business*/) {
  const search = () => postDAO.search();

  return {
    search
  };
}


module.exports = {
  create
};
