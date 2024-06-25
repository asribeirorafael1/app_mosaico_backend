module.exports = (app) => {
    const AuthController = require('./auth.controller');

    app.post('/api-mosaiko/auth/login', AuthController.login);
    app.get('/api-mosaiko/ping', function(req, res){
        res.send("OK Pingado");
    });
    app.post('/api-mosaiko/auth/signup', AuthController.signup);
    app.post('/api-mosaiko/auth/forgetpassword', AuthController.forgetPassword);
};