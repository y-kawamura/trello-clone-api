const { authenticate } = require('@feathersjs/authentication').hooks;

const { setField } = require('feathers-authentication-hooks');

const setUserId = setField({
  from: 'params.user._id',
  as: 'data.ownerId'
});

const limitToOwner = setField({
  from: 'params.user._id',
  as: 'params.query.ownerId'
});

const limitToUser = setField({
  from: 'params.user._id',
  as: ['params.query.ownerId', 'params.query.members']
});

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ limitToUser ],
    get: [ limitToUser ],
    create: [ setUserId ],
    update: [ limitToOwner ],
    patch: [ limitToOwner ],
    remove: [ limitToOwner ]
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
