const respondSuccess = (res, statusCode, data) => {
	res.status(statusCode).json(data);
};

const respondErr = (res, errStatusCode, err) => {
	res.status(errStatusCode).json({ errors: err });
};

const handlerError = (err, req, res, next) => {
	const message = err.message
	res.status(err.statusCode).json({ errors: message });
};

module.exports = { respondSuccess, respondErr, handlerError }