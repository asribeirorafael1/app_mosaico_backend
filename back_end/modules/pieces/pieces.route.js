const PiecesController = require('./pieces.controller');
const AuthService = require('../auth/auth.service');

module.exports = (app, io) => {

    app.post('/api-mosaiko/pieces/add', AuthService.userLogged, PiecesController.add);
    app.post('/api-mosaiko/pieces/edit/:pieceId', PiecesController.edit);
    app.get('/api-mosaiko/pieces/getAll', AuthService.userLogged, PiecesController.getAll);
    app.get('/api-mosaiko/pieces/get/:pieceId', PiecesController.getPieceById);
    app.get('/api-mosaiko/pieces/removeAllPieces/:mosaicId', AuthService.userLogged, PiecesController.removeAllPieces);
    app.get('/api-mosaiko/pieces/getByIdUsability/:pieceId', PiecesController.getByIdUsability);
    app.get('/api-mosaiko/pieces/random/:mosaicId', PiecesController.getByRandom);
    app.post('/api-mosaiko/pieces/reset-piece/:pieceId', PiecesController.resetPiece);
};
