const Config = require('../configs/config');

module.exports = (app) => {
    app.listen(Config.Server.port, onListen);
    
    function onListen() {
        console.log(`Servidor iniciado com sucesso na porta ${Config.Server.port}`);
    }
};