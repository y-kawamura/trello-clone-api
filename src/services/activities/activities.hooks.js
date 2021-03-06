const { authenticate } = require('@feathersjs/authentication').hooks;

const { setField } = require('feathers-authentication-hooks');
const { BadRequest, NotAuthenticated, MethodNotAllowed } = require('@feathersjs/errors');
const mongoose = require('mongoose');

const setUserId = setField({
  from: 'params.user._id',
  as: 'data.userId'
});

const methodNotAllow = () => {
  throw new MethodNotAllowed('This method is not allowed');
};

const isBoardUser = async (context, boardId) => {
  if (!boardId) {
    throw new BadRequest('board id must be specified');
  }

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

const isBoardUserByData = async (context) => {
  const boardId = context.data.boardId;
  return await isBoardUser(context, boardId);
};

const isBoardUserByQuery = async (context) => {
  const boardId = context.params.query.boardId;
  return await isBoardUser(context, boardId);
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ isBoardUserByQuery ],
    get: [ methodNotAllow ],
    create: [ setUserId, isBoardUserByData ],
    update: [ methodNotAllow ],
    patch: [ methodNotAllow ],
    remove: [ methodNotAllow ]
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
