var Schema = require('mongoose').Schema;
var PiecesSchema = require('../common/pieces.schema');

module.exports = {
    codigo_treinamento: {
        type: String,
        required: true
    },
    participantes: {
        type: Number
    },
    imagem: {
        title: String,
        image: Buffer
    },
    qrcode: {
        type: String
    },
    eixoX: {
        type: Number
    },
    eixoY: {
        type: Number
    },
    lista_pecas: {
        type: [
            {
                type: Schema.ObjectId,
                ref: 'Pieces',
                default: null,
                index: true
            }
        ],
        default: []
    },
    status: {
        type: Boolean,
        default: false
    },
    closed: {
        type: Boolean,
        default: false
    },
    ativo: {
        type: Boolean,
        default: true
    }
};