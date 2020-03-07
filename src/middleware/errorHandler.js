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

  req.logger.error(
    {
      error: {
        message: err.message
      },
      request: {
        path: req.originalUrl,
        method: req.method
      }
    },
    "Error received from a route"
  );
  const { statusCode } = errors[err.name] || errors.Default;
  const errorResponse = {
    error: err.name,
    message: err.message
  };
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
