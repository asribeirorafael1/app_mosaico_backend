const TokenService = require('../../../server/services/token/token.service');
const APIService = require('../../../server/services/api/api.service');

module.exports = {
    userLogged: userLogged
};

function userLogged(req, res, next) {
    const token = req.headers.authorization;
    const isValidToken = TokenService.validate(token);

    if (!isValidToken) {
        return APIService.error(res, 1, 'Credenciais são obrigatórias', {});
    }

    return next();
}