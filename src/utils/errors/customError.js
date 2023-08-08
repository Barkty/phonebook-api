class CustomAPIError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.success = 0
    }
}
  
const createCustomError = (msg, statusCode) => {
    return new CustomAPIError(msg, statusCode);
};
  
export { createCustomError, CustomAPIError };