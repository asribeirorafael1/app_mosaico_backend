module.exports = {
    nome_funcionario: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    senha: {
        type: String,
        required: true
    },
    hash_username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    permissao: {
        /*
            1 = master,
            2 = admin,
            3 = user
         */
        type: Number,
        min: 1,
        max: 3,
    },
    ativo: {
        type: Boolean,
        default: true
    },
    reset_senha: {
        type: Boolean,
        default: false
    }
};