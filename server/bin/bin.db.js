const Config = require('../configs/config');
const DBService = require('../services/db/db.service');
const UsersSchema = require('../../back_end/modules/users/users.schema');
const MosaicsSchema = require('../../back_end/modules/mosaics/mosaics.schema');
const PiecesSchema = require('../../back_end/modules/pieces/pieces.schema');

module.exports = () => {
    DBService.DB.init(Config.name, Config.DB.url, { useNewUrlParser: true, dbName: Config.name, useUnifiedTopology: true, useCreateIndex: true });
    DBService.Model.init(Config.name, 'Users', UsersSchema);
    DBService.Model.init(Config.name, 'Mosaics', MosaicsSchema);
    DBService.Model.init(Config.name, 'Pieces', PiecesSchema);
};
