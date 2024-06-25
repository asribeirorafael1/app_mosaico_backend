const Config = require('../configs/config');

module.exports = (app) => {
    const server = require('http').createServer(app);
    const io = require('socket.io')(server,  {
        cors: {
            origin: '*',
        },
        path: '/socket-mosaiko'
    });

    io.on('connection', function (socket) {
        console.log('Socket Conectado:'+ socket.id);

        socket.on('sendUploadImage', function (data) {
            console.log("Imagem Atualizada");
            socket.broadcast.emit('receivedUpdateImage', { type: "new-message", text: data });
        });
    });

    server.listen(Config.Socket.port, onListen);

    function onListen() {
        console.log(`Servidor Socket iniciado com sucesso na porta ${Config.Socket.port}`);
    }
};