'use strict';

function fromDB(element) {
  if (element instanceof Array) {
    return element.map(fromDB);
  } else if (element && element.hits && element.hits.hits) {
    return fromDB(element.hits.hits);
  }
  if (!element) {
    return null;
  }
  if (element._source) {
    element._source.id = element._id;
    return element._source;
  } else if (element.fields) {
    element.fields.id = element._id;
    return element.fields;
  }
  return element._id;
}

function forPagination(element) {
  return { results: fromDB(element), total: element.hits.total };
}

module.exports = {
  fromDB,
  forPagination
};
