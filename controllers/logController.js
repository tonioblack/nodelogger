const { ObjectID } = require('mongodb');

const collectionName = 'logs';

function logController(db) {
    async function post(req, res) {
        const log = req.body;
        const mandatoryFields = [
            'GeneratingProgram',
            'Message',
            'Type',
            'ApplicationArea',
        ];
        const status = ['Info', 'Warning', 'Error', 'Success'];
        if (!log.InsertDate) {
            log.InsertDate = new Date();
        }
        mandatoryFields.forEach((x) => {
            if (!log[x]) {
                res.status(400);
                return res.send(x.concat(' is required'));
            }
            return 'OK';
        });
        if (status.indexOf(log.Type) === -1) {
            res.status(400);
            return res.send('Log type '.concat(log.Type).concat(' is unknow, use ').concat(status.join(' or ')));
        }
        try {
            const result = await db.collection(collectionName).insertOne(log);
            res.status(201);
            return res.json(result);
        } catch (ex) {
            res.status(500);
            return res.json(ex);
        }
    }
    async function get(req, res) {
        const { query } = req;
        try {
            const result = await db.collection(collectionName).find(query).toArray();
            res.status(200);
            return res.json(result);
        } catch (ex) {
            res.status(500);
            return res.send(ex);
        }
    }
    async function getByIdMiddleware(req, res, next) {
        const { id } = req.params;
        const mongoId = new ObjectID(id);

        try {
            const result = await db.collection(collectionName).findOne({ _id: mongoId });
            res.status(200);
            res.log = result;
            if (res.log == null) {
                return res.sendStatus(404);
            }
            return next();
        } catch (ex) {
            res.status(500);
            return res.send(ex);
        }
    }
    async function deleteRecord(req, res) {
        const { log } = res;
        try {
            // eslint-disable-next-line no-underscore-dangle
            const result = await db.collection(collectionName).deleteOne({ _id: log._id });
            res.status(200);
            return res.json(result);
        } catch (ex) {
            res.status(500);
            return res.send(ex);
        }
    }

    return {
        post,
        get,
        getByIdMiddleware,
        deleteRecord,
    };
}

module.exports = logController;
