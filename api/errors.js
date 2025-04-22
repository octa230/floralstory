class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = 'NotFoundError';
      this.statusCode = 404;
    }
  }
  
  class InvalidOperationError extends Error {
    constructor(message) {
      super(message);
      this.name = 'InvalidOperationError';
      this.statusCode = 400;
    }
  }