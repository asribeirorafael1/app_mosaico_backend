const MosaicsController = require('./mosaics.controller');
const AuthService = require('../auth/auth.service');

module.exports = (app) => {
    app.post('/api-mosaiko/mosaics/add', AuthService.userLogged, MosaicsController.add);
    app.post('/api-mosaiko/mosaics/edit/:mosaicId', AuthService.userLogged, MosaicsController.edit);
    app.post('/api-mosaiko/mosaics/close/:mosaicId', AuthService.userLogged, MosaicsController.close);
    app.get('/api-mosaiko/mosaics/remove/:mosaicId', AuthService.userLogged, MosaicsController.remove);
    app.get('/api-mosaiko/mosaics/getAll', AuthService.userLogged, MosaicsController.getAll);
    app.get('/api-mosaiko/mosaics/getAllActive', AuthService.userLogged, MosaicsController.getAllActive);
    app.get('/api-mosaiko/mosaics/getByPiece/:pieceId', MosaicsController.getMosaicByPiece);
    app.get('/api-mosaiko/mosaics/getById/:mosaicId', MosaicsController.getMosaicById);
    app.get('/api-mosaiko/mosaics/qrcodePDF/:mosaicId', MosaicsController.qrCodeGeneration);
    app.post('/api-mosaiko/mosaics/qrcodemosaic',AuthService.userLogged, MosaicsController.qrCodeMosaicGeneration)
};
