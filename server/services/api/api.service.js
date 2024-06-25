module.exports = {
    error: error,
    success: success
};

function error(res, code, message, Response) {
    res.json({
        status: false,
        code: code,
        message: message,
        Response: Response
    });
}

function success(res, code, message = '', Response = {}) {
    res.json({
        status: true,
        code: code,
        message: message,
        Response: Response
    });
}
