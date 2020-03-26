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

const isBoardUser = async (context, listId) => {
  const lists = mongoose.model('lists');
  const list = await lists.findOne({ _id: listId });
  const boardId = list.boardId;

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
  const listId = await getListIdByCardId(context.id);
  await isBoardUser(context, listId);
};

const isBoardUserByData = async (context) => {
  const listId = context.data.listId;
  await isBoardUser(context, listId);
};

const isBoardUserByQuery = async (context) => {
  const listId = context.params.query.listId;
  await isBoardUser(context, listId);
};

module.exports = {
  before: {
    all: [ authenticate('jwt'), ],
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
