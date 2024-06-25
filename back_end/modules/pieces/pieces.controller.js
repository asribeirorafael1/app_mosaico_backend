const APIService = require('../../../server/services/api/api.service');
const PiecesModel = require('./pieces.model');
const MosaicsModel = require('../mosaics/mosaics.model');
const OptionsUpdate = {new: true};

module.exports = {
    add: add,
    edit: edit,
    getAll: getAll,
    getPieceById: getPieceById,
    removeAllPieces: removeAllPieces,
    getByIdUsability: getByIdUsability,
    getByRandom: getByRandom,
    resetPiece: resetPiece
};

// add ---

function add(req, res) {
    let NewPiece = req.body;

    let imageBuffer1 = new Buffer(NewPiece.imagem_peca.split(",")[1],"base64");
    NewPiece.imagem_peca = { "title": NewPiece.imagem_peca.split(",")[0], "image": imageBuffer1 };
    let imageBuffer2 = new Buffer(NewPiece.imagem_participante.split(",")[1],"base64");
    NewPiece.imagem_participante = { "title": NewPiece.imagem_participante.split(",")[0], "image": imageBuffer2};

    NewPiece = new PiecesModel(NewPiece);

    //noinspection JSUnresolvedFunction
    NewPiece.save(_onAddPiece(res));
}

function _onAddPiece(res) {
    return function (ErrorSavePiece, PieceSaved) {
        if (ErrorSavePiece) {
            return APIService.error(res, 500, 'Peça não foi adicionada', ErrorSavePiece);
        }

        return APIService.success(res, 200, 'Peça adicionada com sucesso', PieceSaved);
    };
}

// edit ---
function edit(req, res) {

    let NewPiece = req.body;

    NewPiece.closed = true;
    NewPiece.utilizavel = false;

    let imageBuffer1 = new Buffer(NewPiece.imagem_peca.split(",")[1],"base64");
    NewPiece.imagem_peca = { "title": NewPiece.imagem_peca.split(",")[0], "image": imageBuffer1 };
    if(NewPiece.imagem_participante !== "" && NewPiece.imagem_participante !== undefined  && NewPiece.imagem_participante !== null) {
        let imageBuffer2 = new Buffer(NewPiece.imagem_participante.split(",")[1], "base64");
        NewPiece.imagem_participante = {"title": NewPiece.imagem_participante.split(",")[0], "image": imageBuffer2};
    }

    //noinspection JSUnresolvedVariable
    NewPiece = {
        $set: NewPiece
    };

    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    PiecesModel
        .findByIdAndUpdate(req.params.pieceId, NewPiece, OptionsUpdate)
        .lean()
        .exec(_onEditPiece(res));

}

function _onEditPiece(res) {
    return function (ErrorEditPiece, PieceEdited) {
        if (ErrorEditPiece) {
            return APIService.error(res, 500, 'Peça não foi editada', ErrorEditPiece);
        }

        return APIService.success(res, 200, 'Peça editada com sucesso', PieceEdited);
    };
}


function getAll(req, res) {
    const QueryGetAllPieces = {
        ativo: true
    };

    PiecesModel
        .find(QueryGetAllPieces)
        .lean()
        .exec(_onGetAllPieces(res));
}

function _onGetAllPieces(res) {
    return function (ErrorPopulateAllPieces, PiecesPopulated) {
        if (ErrorPopulateAllPieces) {
            return APIService.error(res, 500, 'Peças não puderam ser obtidas', ErrorPopulateAllPieces);
        }

        PiecesPopulated.forEach(piece => {
            piece.imagem_peca = piece.imagem_peca.title + ',' + piece.imagem_peca.image.toString('base64');
            if(piece.imagem_participante)
                piece.imagem_participante = piece.imagem_participante.title + ',' + piece.imagem_participante.image.toString('base64');
        });

        return APIService.success(res, 200, 'Peças obtidas com sucesso', PiecesPopulated);
    };
}


function getPieceById(req, res) {
    const QueryGetAllPieces = {
        ativo: true,
        _id: req.params.pieceId
    };

    PiecesModel
        .findOne(QueryGetAllPieces)
        .lean()
        .exec(_onGetPiece(res));
}

function _onGetPiece(res) {
    return function (ErrorGetAllPieces, PieceFound) {
        if (ErrorGetAllPieces) {
            return APIService.error(res, 400, 'Peça não pode ser obtida', ErrorGetAllPieces);
        }

        PieceFound.imagem_peca = PieceFound.imagem_peca.title + ',' + PieceFound.imagem_peca.image.toString('base64');
        if(PieceFound.imagem_participante)
            PieceFound.imagem_participante = PieceFound.imagem_participante.title + ',' + PieceFound.imagem_participante.image.toString('base64');

        return APIService.success(res, 500, 'Peça obtida com sucesso', PieceFound);
    };
}


function removeAllPieces(req, res) {
    const QueryGetAllMosaics = {
        ativo: true,
        _id: req.params.mosaicId
    };

    MosaicsModel
        .findOne(QueryGetAllMosaics)
        .populate('lista_pecas')
        .lean()
        .exec(_onGetMosaicRemoveAll(res));
}

function _onGetMosaicRemoveAll (res) {
    return function (ErrorPopulateMosaic, MosaicPopulated) {
        if (ErrorPopulateMosaic) {
            return APIService.error(res, 500, 'Não foi possível obter o mosaico.', ErrorPopulateMosaic);
        }

        let lista_pecas = MosaicPopulated.lista_pecas;

        lista_pecas.forEach(piece => {
            let pieceId = piece._id;
            piece.imagem_participante = "";
            piece.nome_participante = "";
            piece.utilizavel = true;
            piece.closed = false;

            piece = {
                $set: piece
            }

            PiecesModel.findByIdAndUpdate(pieceId, piece, OptionsUpdate).exec();
        });

        return APIService.success(res, 200, 'Peças dos participantes removidas com sucesso', {});
    };
}


function getByIdUsability(req, res) {
    const QueryGetAllPieces = {
        ativo: true,
        _id: req.params.pieceId
    };

    PiecesModel
        .findOne(QueryGetAllPieces)
        .lean()
        .exec(_onGetPieceUsability(res));
}

function _onGetPieceUsability(res) {
    return function (ErrorGetAllPieces, PieceFound) {
        if (ErrorGetAllPieces) {
            return APIService.error(res, 400, 'Peça não pode ser obtida', ErrorGetAllPieces);
        }

        let fatorImage = 0.75;

        const qr = require('qr-image');

        const url = 'http://localhost:4200/#/upload/' + PieceFound._id + "&step3";

        const code = qr.imageSync(url);

        PieceFound.qr_image = "data:image/png;base64," + code.toString('base64');

        let PieceUpdate = {
            $set: PieceFound
        };

        PiecesModel.findByIdAndUpdate(PieceFound._id, PieceUpdate, OptionsUpdate).exec();

        PieceFound.imagem_peca = PieceFound.imagem_peca.title + ',' + PieceFound.imagem_peca.image.toString('base64');
        if(PieceFound.imagem_participante)
            PieceFound.imagem_participante = PieceFound.imagem_participante.title + ',' + PieceFound.imagem_participante.image.toString('base64');

        return APIService.success(res, 500, 'Peça obtida com sucesso', PieceFound);
    };
}


function getByRandom(req, res) {
    const QueryGetAllMosaics = {
        ativo: true,
        _id: req.params.mosaicId
    };

    MosaicsModel
        .findOne(QueryGetAllMosaics)
        .populate("lista_pecas")
        .lean()
        .exec(_onGetPieceRandom(res));
}

function _onGetPieceRandom(res) {
    return function (ErrorGetAllPieces, PieceFound) {
        if (ErrorGetAllPieces) {
            return APIService.error(res, 400, 'Peça não pode ser obtida', ErrorGetAllPieces);
        }

        let lista_pecas = PieceFound.lista_pecas.filter(f => f.utilizavel === true);
        let pieceUtilizavel;

        if(lista_pecas.length !== 0){
            pieceUtilizavel = lista_pecas[Math.floor(Math.random() * lista_pecas.length)];

            pieceUtilizavel.utilizavel = false;

            let PieceUpdate = {
                $set: pieceUtilizavel
            };

            PiecesModel.findByIdAndUpdate(pieceUtilizavel._id, PieceUpdate, OptionsUpdate).exec();

            if(pieceUtilizavel){
                pieceUtilizavel.imagem_peca = pieceUtilizavel.imagem_peca.title + ',' + pieceUtilizavel.imagem_peca.image.toString('base64');
                if(pieceUtilizavel.imagem_participante)
                    pieceUtilizavel.imagem_participante = pieceUtilizavel.imagem_participante.title + ',' + pieceUtilizavel.imagem_participante.image.toString('base64');
            }
        }else{
            pieceUtilizavel = {};
        }



        return APIService.success(res, 500, 'Peça obtida com sucesso', pieceUtilizavel);
    };
}

function resetPiece(req, res) {

    let NewPiece = req.body;

    NewPiece.closed = false;
    NewPiece.utilizavel = true;

    let imageBuffer1 = new Buffer(NewPiece.imagem_peca.split(",")[1],"base64");
    NewPiece.imagem_peca = { "title": NewPiece.imagem_peca.split(",")[0], "image": imageBuffer1 };
    NewPiece.imagem_participante = "";
    NewPiece.nome_participante = "";

    //noinspection JSUnresolvedVariable
    NewPiece = {
        $set: NewPiece
    };

    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    PiecesModel
        .findByIdAndUpdate(req.params.pieceId, NewPiece, OptionsUpdate)
        .lean()
        .exec(_onResetPiece(res));

}

function _onResetPiece(res) {
    return function (ErrorEditPiece, PieceEdited) {
        if (ErrorEditPiece) {
            return APIService.error(res, 500, 'Peça não foi resetada', ErrorEditPiece);
        }

        return APIService.success(res, 200, 'Peça resetada com sucesso', PieceEdited);
    };
}
