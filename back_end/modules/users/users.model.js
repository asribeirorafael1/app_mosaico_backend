const DBService = require('../../../server/services/db/db.service');
const Config = require('../../../server/configs/config');

module.exports = DBService.Model.get(Config.name, 'Users');