'use strict';

const _ = require('lodash');
const $http = require('http-as-promised');
const crypto = require('crypto');
const moment = require('moment');
const xml2js = require('xml2js');

const feedItemDAO = require('../dao/feedItemDAO');


const sha256 = input => {
  const hash = crypto.createHash('sha256');
  hash.update(input);
  return hash.digest('hex');
};

const parseRSS = async body => {
  const mapFields = (mapping, item) => _.reduce(_.keys(mapping),
    (acc, field) => _.set(acc, field, _.get(item, mapping[field])), item);
  const result = await xml2js.parseStringPromise(body);
  return _.chain(result)
    .get('rss.channel[0].item')
    .map(i => mapFields({ title: 'title.0', link: 'link.0', pubDate: 'pubDate.0', guid: 'guid[0]._' }, i))
    .map(({ title, link, pubDate, guid }) => ({ title, link, createDate: moment(pubDate).valueOf(), id: guid }))
    .value();
};

const parse = (format, body) => {
  switch (format) {
    case 'rss':
      return parseRSS(body);
    default:
      throw new Error(`Unsupported feed format: ${format}`);
  }
};

const mapIds = (id, items) => _.map(items, i => _.set(i, 'id', `${id}-${sha256(i.id)}`));

const fetchFeed = async ({ id, url, format }) => {
  // TODO pass the lastRead argument
  const body = await $http.get(url, { resolve: 'body' });
  const items = await parse(format, body);
  await feedItemDAO.saveBulk(mapIds(id, items));
};

module.exports = {
  fetchFeed
};

fetchFeed({
  id: 'ohawv28BZGZcERoSWG84',
  // url: 'https://toshitimes.com/feed/',
  url: 'http://localhost:5000/sample/rss/toshi-times.xml',
  format: 'rss'
});
