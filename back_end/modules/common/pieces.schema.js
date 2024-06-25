var Schema = require('mongoose').Schema;

module.exports = {
    piece: {
        type: Schema.ObjectId,
        ref: 'Pieces',
        default: null,
        index: true
    }
};

