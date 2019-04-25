require('should');
const sinon = require('sinon');
const logController = require('../controllers/logController');

const db = {
    collection: () => ({
        insertOne: () => {

        },
        find: () => ({
            toArray: () => ([{ test: 'test' }]
            ),
        }),
        deleteOne: () => {

        },
    }),
};
const res = {
    status: sinon.spy(),
    send: sinon.spy(),
    json: sinon.spy(),
};

describe('Log controller tests:', () => {
    describe('get', () => {
        it('should get data from db', (done) => {
            const req = {
                query: {
                    test: 'test',
                },
            };
            const controller = logController(db);
            controller.get(req, res).then(() => {
                res.status.calledWith(200).should.equal(true, 'Bad status '.concat(res.status.args[0]));
                res.json.called.should.equal(true);
                done();
            });
        });
    });
    describe('delete', () => {
        it('should delete data from db', (done) => {
            const req = {
                log: {
                    _id: 'test',
                },
            };
            const controller = logController(db);
            controller.deleteRecord(req, res).then(() => {
                res.status.calledWith(200).should.equal(true, 'Bad status '.concat(res.status.args[0]));
                res.json.called.should.equal(true);
                done();
            });
        });
    });
    describe('post', () => {
        it('should not allow an empty Message on post', (done) => {
            const req = {
                body: {
                    GeneratingProgram: 'Mocha',
                    // Message: 'TestMessage',
                    Type: 'Info',
                    ApplicationArea: 'Program',
                },
            };

            const controller = logController(db);
            controller.post(req, res).then(() => {
                res.status.calledWith(400).should.equal(true, 'Bad status '.concat(res.status.args[0]));
                res.send.calledWith('Message is required').should.equal(true);
                done();
            });
        });
        it('should not allow invalid type', (done) => {
            const req = {
                body: {
                    GeneratingProgram: 'Mocha',
                    Message: 'TestMessage',
                    Type: 'Invalid',
                    ApplicationArea: 'Program',
                },
            };

            const controller = logController(db);
            controller.post(req, res).then(() => {
                res.status.calledWith(400).should.equal(true, 'Bad status '.concat(res.status.args[0]));
                res.send.calledWith('Log type Invalid is unknow, use Info or Warning or Error or Success').should.equal(true);
                done();
            });
        });

        it('should allow complex logs', (done) => {
            const req = {
                body: {
                    GeneratingProgram: 'Mocha',
                    Message: 'TestMessage',
                    Type: 'Invalid',
                    ApplicationArea: 'Program',
                    Complex: [
                        {
                            test: 'true',
                        },
                    ],
                },
            };

            const controller = logController(db);
            controller.post(req, res).then(() => {
                res.status.calledWith(201).should.equal(true, 'Bad status '.concat(res.status.args[0]));
                res.json.called.should.equal(true);
                done();
            });
        });
    });
});
