const Fastify = require('fastify');
const fp = require('fastify-plugin');

const app = Fastify({logger: false});

// 模拟数据库连接
function asyncFunction() {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve();
        }, 3000);
    })
}

// 不用fp的插件
async function dbPluginWithoutFp(fastify, options) {
    await asyncFunction();
    // 挂到此作用域当中
    fastify.decorate('db',{
        find: (id) => {return {id: id, name: '张三'}},
        findAll: () => {
            return [
                {id:1, name: "李四"},
                {id:2, name: "王五"}
            ]
        }
    });
    console.log("dbPluginWithoutFp连接完成，db已挂载");
}


// 使用了fp的插件
const dbPlugin = fp(
        async function(fastify, options) {
        await asyncFunction();
        fastify.decorate('db',{
            find: (id) => {return {id: id, name: '张三'}},
            findAll: () => {
                return [
                    {id:1, name: "李四"},
                    {id:2, name: "王五"}
                ]
            }
        });
        console.log("dbPlugin连接完成，db已挂载");
    }
);

// 路由插件
async function userRoutes(fastify, options){
    fastify.get("/", async (request, reply) => {
        const users = fastify.db.findAll();
        return users;
    });

    fastify.get("/:id", async (request, reply) => {
        const {id} = request.params;
        const user =fastify.db.find(id);
        if(!user){
            reply.code(404);
            return {msg: '用户不存在'};
        }
        return user;
    });
}

//app.register(dbPlugin);
app.register(dbPluginWithoutFp);
app.register(userRoutes);


async function start() {
    try {
        await app.listen({port: 3000});
    } catch (err){
        console.log(err);
    }
}

start();