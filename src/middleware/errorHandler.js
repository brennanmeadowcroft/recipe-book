const errorHandler = (err, req, res, next) => {
  try {
    const errors = {
      AlreadyExistsError: {
        statusCode: 409,
      },
      NotFoundError: {
        statusCode: 404,
      },
      ValidationError: {
        statusCode: 400,
      },
      UnspecifiedError: {
        statusCode: 500,
      },
    };

    const errorName = err.name || "UnspecifiedError";

    req.logger.error(
      {
        error: {
          message: err.message,
        },
        request: {
          path: req.originalUrl,
          method: req.method,
        },
      },
      `${errorName} received from a route`
    );

    const { statusCode } = errors[errorName] || errors.UnspecifiedError;
    const errorResponse = {
      error: errorName,
      message: err.message,
    };
    res.status(statusCode).json(errorResponse);
  } catch (err) {
    console.error("Problem with error handler.  Shutting down.");
    console.error(err);
    process.exit(1);
  }
};

module.exports = errorHandler;
