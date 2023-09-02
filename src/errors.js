class BaseError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class DaemonError extends BaseError {
  constructor(message) {
    super(message);
  }
}

export { DaemonError };
