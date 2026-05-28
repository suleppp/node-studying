class NetworkError extends Error{
    constructor(message,statusCode){
        super(message);
        this.name = "NetworkError" // 覆盖默认的Error
        this.statusCode = statusCode
    }
}

let err = new NetworkError("找不到","404")
console.log(err)