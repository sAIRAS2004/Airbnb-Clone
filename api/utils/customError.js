// Custom Error Class for consistent error handling
// Modified by Saira Shakeel

class CustomError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

module.exports = CustomError;
