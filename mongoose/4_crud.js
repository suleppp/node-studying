const User = require('./3_userSchema');

async function createUser() {
    try {
        // 方式一：实例化之后调用save
        const newUser = new User({
            username: "zhangsan",
            email: "zs@test.com",
            phone: "16600000000",
            age: 25,
            role: "admin",
            website: "https://test.com"
        });
        const savedDoc = await newUser.save();

        // 方式二，使用Model.create()
        // const savedDoc = await User.create({
        //     username: "zhangsan",
        //     email: "zs@test.com",
        //     phone: "16600000000",
        //     age: 25,
        //     role: "admin",
        //     website: "https://test.com"
        // })
    } catch (err) {
        console.error(err);
    }
}

async function findUser() {
    // 查询用户，支持链式调用
    const users = await User.find({role: "user"})
                    .where('age').gte(18).lt(30)
                    .sort({age: -1})
                    .skip(10)
                    .limit(5);

    // 查询单条记录
    const oneUser = await User.findOne({email: "zs@test.com"});

    // 按主键id查询
    const userById = await User.findById("64a1b2c3d4e5f600010000aa");
}

async function updateUser() {
    // findOneAndUpdate三个参数：查询条件，更新内容，配置选项
    const updatedUser = await User.findOneAndUpdate(
        {email: "zs@test.com"},
        {
            $set: {age: 30, role: "user"}
        },
        {
            new: true, // 默认返回更新前的旧数据，开启后返回更新后的最新数据
            runValidators: true // 执行Schema中的校验规则
        }
    );

    // 如果只更新内容但是不关心返回的数据内容，可以用updateOne或updateMany
    // await User.updateOne(
    //     {email: "zs@test.com"},
    //     {
    //         $set: {age: 30, role: "user"}
    //     },
    //     {
    //         new: true, // 默认返回更新前的旧数据，开启后返回更新后的最新数据
    //         runValidators: true // 执行Schema中的校验规则
    //     })
}

async function deleteUser() {
    // 删除匹配条件的第一条记录
    await User.deleteOne({email: "zs@test.com"});
    // 批量删除符合条件的所有记录
    await User.deleteMany({role: "user", age: {$gt: 50}});
    // 按id删除，并且返回这条被删除的记录
    const deletedUser = await User.findByIdAndDelete("64a1b2c3d4e5f600010000aa")
}