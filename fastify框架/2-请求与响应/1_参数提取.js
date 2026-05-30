const Fastify = require('fastify');
const app = Fastify({logger: true});

// 路径参数
app.get('/users/:id', async (request, response) => {
    console.log("1===>", request.params);
    // 1===> NullObject <[Object: null prototype] {}> { id: '15' }
    const {id} = request.params;
    return {
        id: id,
        msg: "路径参数"
    }
})


// 查询参数
app.get('/users',async (request, response) => {
    console.log("2===>", request.query);
    // 2===> Empty <[Object: null prototype] {}> { page: '3', size: '5' }
    const {page = 1, size = 10} = request.query; // 可以通过解构设置默认值

    return {
        page: page,
        size: size,
        msg: "查询参数"
    }
})

// 请求体
app.post('/users', async (request, response) => {
    console.log("3===>", request.body);
    // 3===> { name: 'zhangsan', age: 18 }
    const {name, age} = request.body;
    response.code(201); //返回状态码201
    return {
        name: name,
        age: age,
        msg: "请求体"
    }
})

// 请求头
app.get('/profile', async (request, response) => {
    console.log("4===>", request.headers);
    const token = request.headers['authorization'];
    const {authorization} = request.headers;

    return {
        token: token,
        authorization: authorization
    }
})

async function start(){
    try {
        await app.listen({port: 3000});
    } catch (err){
        console.error("启动失败")
    }
}


start();