const jwt = require('jsonwebtoken');
const Config = require('../../configs/config');

module.exports = {
    create: create,
    validate: validate
};

function create(ObjectToToken) {
    return jwt.sign(ObjectToToken, Config.Credentials.secret);
}

function validate(token) {
    try {
        return jwt.verify(token, Config.Credentials.secret);
    } catch (Exception) {
        return null;
    }
}