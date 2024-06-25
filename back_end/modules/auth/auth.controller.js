const APIService = require('../../../server/services/api/api.service');
const UsersModel = require('../users/users.model');
const HashService = require('../../../server/services/hash/hash.service');
const TokenService = require('../../../server/services/token/token.service');
const OptionsUpdate = {new: true};

module.exports = {
    login: login,
    signup: signup,
    forgetPassword: forgetPassword
};

// login ---

function login(req, res) {

    if (!req.body.username) {
        return APIService.error(res, 201, 'Campo usuário é obrigatório', {});
    }

    if (!req.body.senha) {
        return APIService.error(res, 202, 'Campo senha é obrigatório', {});
    }

    //noinspection JSUnresolvedFunction
    UsersModel
        .find({
            username: req.body.username
        })
        .lean()
        .exec(_onFindUserByUsername(req, res));
}

function _onFindUserByUsername(req, res) {
    return (ErrorFindUserByUsername, Users) => {
        if (ErrorFindUserByUsername) {
            return APIService.error(res, 203, 'Usuários não puderam ser encontrados', ErrorFindUserByUsername);
        }

        if (Users.length > 1) {
            return APIService.error(res, 204, 'Existem mais de dois usuário com mesmo nome entre contato com administrador', {});
        }

        if (!Users.length) {
            return APIService.error(res, 205, 'Usuário e/ou Senha incorreto(s)', {});
        }

        const User = Users[0];

        if (!HashService.validate(req.body.senha, User.senha)) {
            // Same code error (205)
            return APIService.error(res, 205, 'Usuário e/ou Senha incorreto(s)', {});
        }

        const ObjectToken = {
            _id: User._id
        };
        const token = TokenService.create(ObjectToken);
        const ObjectAuth = {
            token: token,
            permission: User.permission,
            user: User._id
        };

        return APIService.success(res, 207, 'Login realizado com sucesso', ObjectAuth);
    };
}

// signup ---

function signup(req, res) {
    let NewUser = req.body;

    NewUser.permission = 3;

    if (!NewUser.username) {
        return APIService.error(res, 208, 'Campo Usuário é obrigatório', {});
    }

    if (!NewUser.senha) {
        return APIService.error(res, 209, 'Campo Senha é obrigatório', {});
    }

    //noinspection JSUnresolvedFunction
    UsersModel
        .find({
            hash_username: NewUser.username.trim().toUpperCase()
        })
        .lean()
        .exec(_onFindUsersExistentByUsername(req, res, NewUser));
}

function _onFindUsersExistentByUsername(req, res, NewUser) {
    return (ErrorFindUsersExistentByUsername, Users) => {
        if (ErrorFindUsersExistentByUsername) {
            return APIService.error(res, 210, 'Usuários não puderam ser encontrados', ErrorFindUsersExistentByUsername);
        }

        if (Users.length > 1) {
            return APIService.error(res, 211, 'Existem mais de dois usuário com mesmo nome entre contato com administrador', {});
        }

        if (Users.length) {
            return APIService.error(res, 212, 'Usuário já existente.', {});
        }

        NewUser.senha = HashService.create(NewUser.senha);

        NewUser = new UsersModel(NewUser);

        //noinspection JSUnresolvedFunction
        NewUser.save(_onAddUser(res));
    }
}

function _onAddUser(res) {
    return function (ErrorSaveUser, UserSaved) {
        if (ErrorSaveUser) {
            return APIService.error(res, 210, 'Usuário não foi cadastrado', ErrorSaveUser);
        }

        return APIService.success(res, 211, 'Usuário cadastrado com sucesso', UserSaved);
    };
}


function forgetPassword(req, res){

    if (! req.body.username) {
        return APIService.error(res, 101, 'Campo usuário é obrigatório', {});
    }

    //noinspection JSUnresolvedFunction
    UsersModel
        .find({
            username: req.body.username.trim()
        })
        .lean()
        .exec(_onFindUserExistentByUsername(req, res));
}

function _onFindUserExistentByUsername(req, res) {
    return (ErrorFindUserExistentByUsername, Users) => {
        if (ErrorFindUserExistentByUsername) {
            return APIService.error(res, 103, 'Usuário não encontrado, entre em contato com os administradores.', ErrorFindUserExistentByUsername);
        }

        let User = Users[0];

        var UserEdited = {
            $set: {
                reset_senha: true
            }
        };

        UsersModel
            .findByIdAndUpdate(User._id, UserEdited, OptionsUpdate)
            .lean()
            .exec(_onForgetPassword(res));
    };
}

function _onForgetPassword(res) {
    return function (ErrorForgetPassword, ForgetPasswordEdited) {
        if (ErrorForgetPassword) {
            return APIService.error(res, 108, 'Usuário não encontrado no sistema, entre em contato com o administrador', ErrorForgetPassword);
        }

        return APIService.success(res, 109, 'Solicitação de Reset de Senha enviado com sucesso.', ForgetPasswordEdited);
    };
}