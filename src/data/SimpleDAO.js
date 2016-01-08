var ObjectID = require('mongodb').ObjectID;
var shortid = require('shortid');

var db = require('../db');


/**
 * A simple data access object.
 * @param collectionName {String} - name of the mongo collection
 * @param useShortId {boolean} - whether or not to use a shortid instead of ObjectID
 * @constructor
 */
function SimpleDAO(collectionName, useShortId) {
  this.useShortId = useShortId || false;
  this.collection = db.collection(collectionName);
}

/**
 *
 * @param object
 * @returns {*}
 */
SimpleDAO.prototype.transform = function (object) {
  return object;
};

/**
 * Applies the transform at the end of a promise
 * @param promise
 */
SimpleDAO.prototype.transformPromise = function (promise) {
  return promise
    .then(function (object) {
      if (object instanceof Array) {
        return object.map(this.transform);
      }
      return this.transform(object);
    }.bind(this));
};

/**
 * Create a new model.
 * @param data
 * @returns {Promise}
 */
SimpleDAO.prototype.create = function (data) {
  data = data || {};
  if (this.useShortId) {
    data['_id'] = data['_id'] || shortid.generate();
  }
  return this.transformPromise(this.collection.insert(data));
};

/**
 * Return a single model.
 * @param id
 * @returns {Promise}
 */
SimpleDAO.prototype.fromId = function (id) {
  if (!this.useShortId) {
    id = ObjectID(id);
  }
  return this.transformPromise(this.collection.findOne({'_id': id}));
};

/**
 * Return a list of models with the given ids.
 * @param ids
 * @returns {Promise}
 */
SimpleDAO.prototype.fromIds = function (ids) {
  // TODO: Make sure this works
  // TODO: Transform promise
  ids = ids || [];
  if (!this.useShortId) {
    ids = ids.map(ObjectID);
  }
  return this.transformPromise(this.collection.find({_id: {$in: ids}}));
};

/**
 * Return all objects.
 */
SimpleDAO.prototype.all = function () {
  return this.transformPromise(this.find());
};

/**
 * Return matching objects.
 */
SimpleDAO.prototype.find = function (query) {
  // TODO: Transform promise
  query = query || {};
  return this.transformPromise(this.collection.find(query).toArray());
};

/**
 * Update and return a model.
 * @param id {string|object}
 * @param update {object}
 * @param multi {=boolean}
 * @returns {Promise}
 */
SimpleDAO.prototype.update = function (id, update) {
  var query;
  if (id instanceof Object && !(id instanceof ObjectID)) {
    query = id;
  } else {
    if (!this.useShortId) {
      id = ObjectID(id);
    }
    query = {'_id': id};
  }
  return this.transformPromise(
    this.collection.findAndModify({
      'new': true,
      'query': query,
      'update': update
    }).then(function (result) {
      if (result.ok) {
        return result.value;
      } else {
        console('ERROR MODIFYING DOCUMENT', result);
        throw new Error('Error Modifying Document');
      }
    }));
};

/**
 * Remove a campaign.
 * @param {string} id
 * @returns {Promise}
 */
SimpleDAO.prototype.remove = function (id) {
  if (!this.useShortId) {
    id = ObjectID(id);
  }
  return this.collection.remove({'_id': id});
};


module.exports = SimpleDAO;