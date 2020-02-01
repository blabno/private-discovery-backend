'use strict';

const likeDAO = require('../dao/likeDAO');
const wallItemDAO = require('../dao/wallItemDAO');


function create(/* business*/) {
  const like = async id => {
    await wallItemDAO.markLiked(id);
    await likeDAO.save({ id, createDate: Date.now() });
  };

  const unlike = async id => {
    await wallItemDAO.markNotLiked(id);
    await likeDAO.remove(id);
  };

  const markNotRead = id => wallItemDAO.markNotRead(id);

  const markRead = id => wallItemDAO.markRead(id);

  const search = filter => wallItemDAO.search(filter);

  const tag = async (id, tags) => {
    const item = await wallItemDAO.getById(id);
    item.tags = tags;
    return await wallItemDAO.save(item);
  };

  return {
    like,
    markNotRead,
    markRead,
    search,
    tag,
    unlike
  };
}


module.exports = {
  create
};
