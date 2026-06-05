class AppError extends Error {
    constructor(errorCode, message) {
        super(message);
        this.error = errorCode;
    }
} 

AppError.PARAMETER_ERROR_CODE = 400;
AppError.FORBIDDEN_ERROR_CODE = 403;
AppError.NO_RESOURCES_ERROR_CODE = 405;
AppError.SERVICE_ERROR_CODE = 500;
AppError.PARAMETER_ERROR_MSG = "参数或者请求头错误";
FORBIDDEN_ERROR = "无权限";
AppError.NO_RESOURCES_ERROR_MSG = "查询数据时未找到资源";
AppError.SERVICE_ERROR_MSG = "服务出现未知错误";


module.exports = AppError;