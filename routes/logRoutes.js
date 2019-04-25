/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const logController = require('../controllers/logController');

function createRoute(db) {
    const logRouter = express.Router();
    const controllers = logController(db);
    logRouter.route('/logs')
        .post(controllers.post)
        .get(controllers.get);

    logRouter.use('/logs/:id', controllers.getByIdMiddleware);
    logRouter.route('/logs/:id')
        .get((req, res) => res.json(res.log))
        .delete(controllers.deleteRecord);
    return logRouter;
}

module.exports = createRoute;
