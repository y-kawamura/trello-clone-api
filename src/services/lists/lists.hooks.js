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

const isBoardUser = async (context, boardId) => {
  const boards = mongoose.model('boards');
  const board = await boards.findOne({ _id: boardId });

  const isOwner = board.ownerId.toString() === context.params.user._id.toString();
  const isMember = board.members.includes(context.params.user._id);
  if (isOwner ||isMember) {
    return context;
  } else {
    throw new NotAuthenticated('You are not board owner');
  }
};

const isBoardUserById = async (context) => {
  const boardId = await getBoardIdByListId(context.id);
  await isBoardUser(context, boardId);
};

const isBoardUserByData = async (context) => {
  const boardId = context.data.boardId;
  await isBoardUser(context, boardId);
};

const isBoardUserByQuery = async (context) => {
  const boardId = context.params.query.boardId;
  await isBoardUser(context, boardId);
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ isBoardUserByQuery ],
    get: [ isBoardUserById ],
    create: [ isBoardUserByData ],
    update: [ isBoardUserById ],
    patch: [ isBoardUserById ],
    remove: [ isBoardUserById ]
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
