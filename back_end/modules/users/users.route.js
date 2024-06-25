const UsersController = require('./users.controller');
const AuthService = require('../auth/auth.service');

module.exports = (app) => {
    app.get('/api-mosaiko/users/add-first-user', UsersController.addFirstUser);
    app.post('/api-mosaiko/users/add', AuthService.userLogged, UsersController.add);
    app.post('/api-mosaiko/users/edit/:userId', UsersController.edit);
    app.get('/api-mosaiko/users/remove/:userId', AuthService.userLogged, UsersController.remove);
    app.get('/api-mosaiko/users/getAll', AuthService.userLogged, UsersController.getAll);
    app.get('/api-mosaiko/users/get/:userId', AuthService.userLogged, UsersController.getUserById);
};
