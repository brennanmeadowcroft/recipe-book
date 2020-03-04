const errorHandler = (err, req, res, next) => {
  const errors = {
    AlreadyExistsError: {
      statusCode: 409
    },
    NotFoundError: {
      statusCode: 404
    },
    ValidationError: {
      statusCode: 400
    },
    Default: {
      statusCode: 500
    }
  };

  console.log("Handling error", err.name);
  const { statusCode } = errors[err.name] || errors.Default;
  const errorResponse = {
    error: err.name,
    message: err.message
  };
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
