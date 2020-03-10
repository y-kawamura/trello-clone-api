const { authenticate } = require('@feathersjs/authentication').hooks;

const mongoose = require('mongoose');

const getBoardIdByListId = async (listId) => {
  const lists = mongoose.model('lists');
  try {
    const list = await lists.findOne({ _id: listId });
    if (list === null) {
      return Promise.reject(new Error('list is not found'));
    }
    return list.boardId;
  } catch (error) {
    return Promise.reject(new Error('list is not found'));
  }
};

const isBoardOwner = async (context, boardId) => {
  const boards = mongoose.model('boards');
  const board = await boards.findOne({ _id: boardId });

  if (board.ownerId.toString() === context.params.user._id.toString()) {
    return context;
  } else {
    return Promise.reject(new Error('Un-Authorized'));
  }
};

const isBoardOwnerById = async (context) => {
  const boardId = await getBoardIdByListId(context.id);
  await isBoardOwner(context, boardId);
};

const isBoardOwnerByData = async (context) => {
  const boardId = context.data.boardId;
  await isBoardOwner(context, boardId);
};

const isBoardOwnerByQuery = async (context) => {
  const boardId = context.params.query.boardId;
  await isBoardOwner(context, boardId);
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ isBoardOwnerByQuery ],
    get: [ isBoardOwnerById ],
    create: [ isBoardOwnerByData ],
    update: [ isBoardOwnerById ],
    patch: [ isBoardOwnerById ],
    remove: [ isBoardOwnerById ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
