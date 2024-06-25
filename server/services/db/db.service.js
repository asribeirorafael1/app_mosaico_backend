const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let DBs = {};

module.exports = {
    DB: {
        init: dbInit
    },
    Model: {
        init: modelInit,
        get: modelGet
    }
};

function dbInit(dbName, dbURL, options) {
    const dbConnection = mongoose.createConnection(dbURL, options);

    DBs[dbName] = {
        connection: dbConnection,
        Models: {}
    };

    return dbConnection;

}

function modelInit(dbName, modelName, ModelSchema) {
    ModelSchema.removed = {
        type: Boolean,
        default: false
    };

    DBs[dbName].Models[modelName] = DBs[dbName].connection.model(modelName, ModelSchema, modelName);
}

function modelGet(dbName, modelName) {
    return DBs[dbName].Models[modelName];
}