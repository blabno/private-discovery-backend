'use strict';

const _ = require('lodash');
const $http = require('http-as-promised');
const moment = require('moment');
const xml2js = require('xml2js');
const uuid = require('uuid');

const { sha256 } = require('./crypto');
const wallItemDAO = require('../dao/wallItemDAO');


const parseRSS = async body => {
  const mapFields = (mapping, item) => _.reduce(_.keys(mapping),
    (acc, field) => _.set(acc, field, _.trim(_.get(item, mapping[field]))), item);
  const result = await xml2js.parseStringPromise(body);
  return _.chain(result)
    .get('rss.channel[0].item')
    .map(i => mapFields({ title: 'title.0', link: 'link.0', pubDate: 'pubDate.0', guid: 'guid[0]._' }, i))
    .map(({ title, link, pubDate, guid }) => ({
      title,
      link,
      createDate: moment(pubDate).valueOf(),
      id: guid || uuid.v4()
    }))
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

const mapIds = (id, items) => _.map(items,
  i => _.chain(i).set('id', `${id}-${sha256(i.id)}`).set('subscription.id', id).value());

const fetchFeed = async ({ id, url, format }) => {
  // TODO pass the lastRead argument
  const body = await $http.get(url, { resolve: 'body' });
  const items = await parse(format, body);
  if (items.length) {
    return wallItemDAO.createBulk(mapIds(id, items));
  }
};

module.exports = {
  fetchFeed
};
