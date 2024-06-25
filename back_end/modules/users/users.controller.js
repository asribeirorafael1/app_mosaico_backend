const APIService = require('../../../server/services/api/api.service');
const HashService = require('../../../server/services/hash/hash.service');
const UsersModel = require('./users.model');
const OptionsUpdate = {new: true};

module.exports = {
    add: add,
    edit: edit,
    remove: remove,
    getAll: getAll,
    getUserById: getUserById,
    addFirstUser: addFirstUser
};

// add ---

function add(req, res) {
    let NewUser = req.body;

    if (!NewUser.nome_funcionario) {
        return APIService.error(res, 101, 'Campo Nome é obrigatório', {});
    }

    if (!NewUser.username) {
        return APIService.error(res, 101, 'Campo username é obrigatório', {});
    }

    if (!NewUser.senha) {
        return APIService.error(res, 102, 'Campo senha é obrigatório', {});
    }

    //noinspection JSUnresolvedFunction
    UsersModel
        .find({
            username: NewUser.username.trim().toUpperCase()
        })
        .lean()
        .exec(_onFindUsersExistentByUsername(req, res, NewUser));
}

function _onFindUsersExistentByUsername(req, res, NewUser) {
    return (ErrorFindUsersExistentByUsername, Users) => {
        if (ErrorFindUsersExistentByUsername) {
            return APIService.error(res, 103, 'Usuários não puderam ser encontrados', ErrorFindUsersExistentByUsername);
        }

        if (Users.length > 1) {
            return APIService.error(res, 104, 'Existem mais de dois usuário com mesmo nome entre contato com administrador', {});
        }

        if (Users.length) {
            return APIService.error(res, 105, 'Usuário já existente.', {});
        }

        NewUser.hash_username = HashService.create(NewUser.username);
        NewUser.senha = HashService.create(NewUser.senha);

        NewUser = new UsersModel(NewUser);

        //noinspection JSUnresolvedFunction
        NewUser.save(_onAddUser(res));
    };
}

function _onAddUser(res) {
    return function (ErrorSaveUser, UserSaved) {
        if (ErrorSaveUser) {
            return APIService.error(res, 106, 'Usuário não foi adicionado', ErrorSaveUser);
        }

        return APIService.success(res, 107, 'Usuário adicionado com sucesso', UserSaved);
    };
}

// edit ---

function edit(req, res) {
    let NewUser = req.body;

    NewUser.hash_username = HashService.create(NewUser.username);
    NewUser.senha = HashService.create(NewUser.senha);

    //noinspection JSUnresolvedVariable
    NewUser = {
        $set: NewUser
    };

    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    UsersModel
        .findByIdAndUpdate(req.params.userId, NewUser, OptionsUpdate)
        .lean()
        .exec(_onEditUser(res));
}

function _onEditUser(res) {
    return function (ErrorEditUser, UserEdited) {
        if (ErrorEditUser) {
            return APIService.error(res, 108, 'Usuário não foi editado', ErrorEditUser);
        }

        return APIService.success(res, 109, 'Usuário editado com sucesso', UserEdited);
    };
}

// remove ---

function remove(req, res) {
    //noinspection JSUnresolvedVariable
    const NewUser = {
        $set: {
            ativo: false
        }
    };

    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    UsersModel
        .findByIdAndUpdate(req.params.userId, NewUser, OptionsUpdate)
        .lean()
        .exec(_onRemoveUser(res));
}

function _onRemoveUser(res) {
    return function (ErrorUpdateUser, UserRemoved) {
        if (ErrorUpdateUser) {
            return APIService.error(res, 110, 'Erro ao remover usuário', ErrorUpdateUser);
        }

        return APIService.success(res, 111, 'Usuário removido com sucesso', UserRemoved);
    };
}


function getAll(req, res) {
    const QueryGetAllUsers = {
        ativo: true
    };

    UsersModel
        .find(QueryGetAllUsers)
        .lean()
        .exec(_onGetAllUsers(res));
}

function _onGetAllUsers(res) {
    return function (ErrorGetAllUsers, UsersFounded) {
        if (ErrorGetAllUsers) {
            return APIService.error(res, 400, 'Usuários não puderam ser obtidos', ErrorGetAllUsers);
        }

        return APIService.success(res, 500, 'Usuários obtidos com sucesso', UsersFounded);
    };
}


function getUserById(req, res) {
    const QueryGetAllUsers = {
        ativo: true,
        _id: req.params.userId
    };

    UsersModel
        .find(QueryGetAllUsers)
        .lean()
        .exec(_onGetUser(res));
}

function _onGetUser(res) {
    return function (ErrorGetAllUsers, UserFound) {
        if (ErrorGetAllUsers) {
            return APIService.error(res, 400, 'Usuário não pode ser obtido', ErrorGetAllUsers);
        }

        return APIService.success(res, 500, 'Usuário obtido com sucesso', UserFound);
    };
}

function addFirstUser(req, res) {
    let NewUser = {
        nome_funcionario: 'Administrador',
        username: 'adminmosaico2021',
        senha: 'adminmosaico2021',
        hash_username: '',
        permissao: 1
    };

    //noinspection JSUnresolvedFunction
    UsersModel
        .find({
            username: NewUser.username.trim().toUpperCase()
        })
        .lean()
        .exec(_onFindUsersExistentByUsernameFirstUser(req, res, NewUser));
}

function _onFindUsersExistentByUsernameFirstUser(req, res, NewUser) {
    return (ErrorFindUsersExistentByUsername, Users) => {
        if (ErrorFindUsersExistentByUsername) {
            return APIService.error(res, 103, 'Usuários não puderam ser encontrados', ErrorFindUsersExistentByUsername);
        }

        if (Users.length > 1) {
            return APIService.error(res, 104, 'Existem mais de dois usuário com mesmo nome entre contato com administrador', {});
        }

        if (Users.length) {
            return APIService.error(res, 105, 'Usuário já existente.', {});
        }

        NewUser.hash_username = HashService.create(NewUser.username);
        NewUser.senha = HashService.create(NewUser.senha);

        NewUser = new UsersModel(NewUser);

        //noinspection JSUnresolvedFunction
        NewUser.save(_onAddUserFirstUser(res));
    };
}

function _onAddUserFirstUser(res) {
    return function (ErrorSaveUser, UserSaved) {
        if (ErrorSaveUser) {
            return APIService.error(res, 106, 'Usuário não foi adicionado', ErrorSaveUser);
        }

        return APIService.success(res, 107, 'Usuário adicionado com sucesso', UserSaved);
    };
}