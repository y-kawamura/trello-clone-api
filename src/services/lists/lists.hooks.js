const { authenticate } = require('@feathersjs/authentication').hooks;

const { BadRequest, NotAuthenticated } = require('@feathersjs/errors');
const mongoose = require('mongoose');

const getBoardIdByListId = async (listId) => {
  const lists = mongoose.model('lists');
  try {
    const list = await lists.findOne({ _id: listId });
    if (list === null) {
      throw new BadRequest('list id must be specified');
    }
    return list.boardId;
  } catch (error) {
    throw new BadRequest('list id must be specified');
  }
};

const isBoardOwner = async (context, boardId) => {
  const boards = mongoose.model('boards');
  const board = await boards.findOne({ _id: boardId });

  if (board.ownerId.toString() === context.params.user._id.toString()) {
    return context;
  } else {
    throw new NotAuthenticated('You are not board owner');
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
