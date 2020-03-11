const { authenticate } = require('@feathersjs/authentication').hooks;

const { BadRequest, NotAuthenticated } = require('@feathersjs/errors');
const mongoose = require('mongoose');

const getListIdByCardId = async (cardId) => {
  const cards = mongoose.model('cards');
  try {
    const card = await cards.findOne({ _id: cardId });
    if (card === null) {
      throw new BadRequest('card id must be specified');
    }
    return card.listId;
  } catch (error) {
    throw new BadRequest('card id must be specified');
  }
};

const isBoardOwner = async (context, listId) => {
  const lists = mongoose.model('lists');
  const list = await lists.findOne({ _id: listId });
  const boardId = list.boardId;

  const boards = mongoose.model('boards');
  const board = await boards.findOne({ _id: boardId });

  if (board.ownerId.toString() === context.params.user._id.toString()) {
    return context;
  } else {
    throw new NotAuthenticated('You are not board owner');
  }
};

const isBoardOwnerById = async (context) => {
  const listId = await getListIdByCardId(context.id);
  await isBoardOwner(context, listId);
};

const isBoardOwnerByData = async (context) => {
  const listId = context.data.listId;
  await isBoardOwner(context, listId);
};

const isBoardOwnerByQuery = async (context) => {
  const listId = context.params.query.listId;
  await isBoardOwner(context, listId);
};

module.exports = {
  before: {
    all: [ authenticate('jwt'), ],
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
