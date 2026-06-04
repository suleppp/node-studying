class BusinessError extends Error {
    constructor(errorCode, message) {
        super(message);
        this.error = errorCode;
    }
}

BusinessError.DEVICE_OFFLINE_ERROR_CODE = 10001;
BusinessError.DEVICE_OFFLINE_ERROR_MSG = "设备离线"