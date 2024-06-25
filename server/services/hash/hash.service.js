const bcrypt = require('bcryptjs');

module.exports = {
    create: create,
    validate: validate
};

function create(password) {
    const salt = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
}

function validate(password, hash) {
    return bcrypt.compareSync(password, hash);
}