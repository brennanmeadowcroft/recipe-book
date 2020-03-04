class AlreadyExistsError extends Error {
  constructor(message) {
    super(message);

    this.constructor = AlreadyExistsError;
    this.message = message;
    this.name = "AlreadyExistsError";
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);

    this.constructor = AlreadyExistsError;
    this.message = message;
    this.name = "NotFoundError";
  }
}

module.exports = {
  AlreadyExistsError,
  NotFoundError
};
