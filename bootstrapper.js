/* eslint-disable no-console */

const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');
const logRouter = require('./routes/logRoutes');

function nodeApp() {
    async function bootstrap() {
        const app = express();
        const port = process.env.PORT || 3000;
        const url = 'mongodb://root:root@mongo:27017';
        const dbName = 'logsDB';
        const client = new MongoClient(url);
        let db = null;
        try {
            await client.connect();
            console.log('Connected to db');
        } catch (ex) {
            console.log(ex);
            process.exit(-1);
        }
        db = client.db(dbName);

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        app.use('/api', logRouter(db));

        app.use(express.static(path.join(__dirname, 'views')));
        app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));
        app.use('/js', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js')));
        app.use('/js', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));

        app.get('/', (req, res) => {
            res.sendFile('index.html');
        });


        app.server = app.listen(port, () => {
            console.log('server is listening on port '.concat(port));
        });
    }
    return { bootstrap };
}

module.exports = nodeApp();
