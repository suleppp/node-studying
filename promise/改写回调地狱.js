function login(user, pass, callback) {
    setTimeout(() => {
        if (user === "admin" && pass === "123") {
            callback(null, { id: 1001, name: "管理员" });
        } else {
            callback("账号或密码错误", null);
        }
    }, 500); 
}

function getPermissions(userId, callback) {
    setTimeout(() => {
        callback(null, ["read", "write"]);
    }, 500); 
}

function writeLog(userId, callback) {
    setTimeout(() => {
        callback(null); 
    }, 500); 
}
// 为了让then能够使用，需要返回一个Promise
// 新函数不需要传入回调了
// 整个函数可以简单理解为对老函数的封装以适配新写法
function loginPromise(user,pass){
    // 按照规范在Promise中传入固定的回调
    // 也就是创建一个新仓库
    // 返回的Promise就是对外界的承诺
    return new Promise((resolve,reject) => {
        // 和旧代码进行交涉
        // 调用老函数，在老函数中处理
        // 并且把结果放进新仓库中
        login(user,pass,(err,user) => {
            if(err) reject(err);//更新状态，存值
            else resolve(user);//更新状态，存值
        })
    })
}

function getPermissionsPromise(userId){
    return new Promise((resolve,reject) => {
        getPermissions(userId,(err,permissions) => {
            if(err) reject(err);
            else resolve(permissions);
        })
    })
}

function writeLogPromise(userId){
    return new Promise((resolve,reject) => {
        writeLog(userId,(err) => {
            if(err) reject(err);
            else resolve();
        })
    })
}

// 由于then只能拿到上一层的产出
// 所以如果跨层了，那么拿不到数据了
// 因此要拿一个临时变量接收一下
let tempUser = null;
loginPromise("admin","123")
.then((user) => {
    tempUser = user;
    return getPermissionsPromise(user.id);
})
.then((permissions) => {
    return writeLogPromise(tempUser.id)
    .then(() => {
        return permissions;//写完日志后还是需要接着响应
    })
})
.then((permissions) => {
    console.log({tempUser,permissions});
})
.catch((err) => {
    console.log({ status: "error", message: err });
})