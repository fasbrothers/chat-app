const errorHandler = (err, req, res, next) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

	const isDevEnv = process.env.NODE_ENV === 'development';

	res.status(statusCode);
	res.json({
		message: err.message,
		stack: isDevEnv ? err.stack : undefined,
		info: err.info,
		type: err.type,
	});
};

export default errorHandler;
