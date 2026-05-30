import Fastify from 'fastify'

const app = Fastify({logger: true})


// 简洁映射
app.get("/users", async (req, res) => {
    return {code: 0,msg: "获取用户列表成功"}
});

// /user/:id 也就意味着请求可以是/user/3 这种，参数会被放到req.params中
// 同时也支持正则的写法，例如/user/:id(^\\d+)，意思是必须是纯数字
// 以及通配符/users/* 匹配该路径下的所有子路径
app.post("/user/:id",async (req, res) => {
    const {id} = req.params;
    return {code: 0, msg: `修改用户id成功，用户id是${id}`}
})
// 需要注意的是，简洁写法和配置对象写法能力是相同的
// 配置作为第二个参数传进去就可以了,只是不方便阅读
app.post("/user2/:id",
    {shema:{}},
    (req, res) => {
    const {id} = req.params;
    return {code: 0, msg: `修改用户id成功，用户id是${id}`}
    })

app.all("/user1/:id1", async (req, res) => {
    const {id} = req.params;
    return {code: 0, msg: `任何请求方法都可以吗`}
})

// 配置对象
app.route({
    method: 'POST',
    url: '/homes',
    handler: async (req, res) => {
        return {code: 0, msg: "获取家庭列表成功"}
    }
})

app.route({
    method: ['GET','POST'],
    url: '/home',
    handler: async (req, res) => {
        return {code: 0, msg:"测试get和post"}
    }
})



async function start(){
    try {
        await app.listen({port: 3000, host: '0.0.0.0'})
    } catch (err){
        app.log.error(err);
        process.exit(1);
    }
}

start();