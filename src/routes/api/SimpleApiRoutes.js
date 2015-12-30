var express = require('express');

/**
 * Create a new simple RESTful api for a resource.
 *
 * @constructor
 * @param dao
 * @param idParam
 */
function SimpleApiRoutes(dao, idParam) {
  this.router = express.Router({mergeParams: true});
  this.instanceRouter = express.Router({mergeParams: true});
  this.router.use('/:' + idParam, this.instanceRouter);

  // Collection Actions
  this.router.route('/')
    // Return all objects
    .get(function (req, res, next) {
      dao.all()
        .error(next)
        .success(function (docs) {
          res.send(docs);
        });
    })
    // Create a new object
    .post(function (req, res, next) {
      dao.create(req.body)
        .error(next)
        .success(function (doc) {
          res.send(doc);
        });
    });

  this.instanceRouter.use(function (req, res, next) {
    // TODO: guarantee existence
    next();
  });

  this.instanceRouter.route('/')
    .get(function (req, res, next) {
      dao.fromId(req.params[idParam])
        .error(next)
        .success(function (doc) {
          res.send(doc)
        });
    })
    .put(function (req, res, next) {
      dao.update(req.params[idParam], req.body)
        .error(next)
        .success(function (doc) {
          res.send({})
        });
    })
    .delete(function (req, res, next) {
      dao.remove(req.params[idParam])
        .error(next)
        .success(function (doc) {
          res.send({})
        });
    });
}


module.exports = SimpleApiRoutes;