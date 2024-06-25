var Schema = require('mongoose').Schema;

module.exports = {
    codigo_peca: {
        type: String
    },
    quadranteX: {
        type: String
    },
    quadranteY: {
        type: String
    },
    imagem_peca: {
        title: String,
        image: Buffer
    },
    imagem_participante: {
        title: String,
        image: Buffer
    },
    qrcode_piece: {
        type: String
    },
    utilizavel: {
        type: Boolean,
        default: true
    },
    closed: {
        type: Boolean,
        default: false
    },
    nome_participante: {
        type: String
    },
    ativo: {
        type: Boolean,
        default: true
    }
};