class DataError extends Error {
    constructor(errorCode, message) {
        super(message);
        this.error = errorCode;
    }
}

DataError.REDIS_ERROR_CODE = 1000;
DataError.MONGO_ERROR_CODE = 2000;

module.exports = DataError;