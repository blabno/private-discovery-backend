'use strict';

const crypto = require('crypto');

const sha256 = input => {
  const hash = crypto.createHash('sha256');
  hash.update(input);
  return hash.digest('hex');
};

module.exports = {
  sha256
};
