const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "用户名必填"], // 必填，并且自定义错误信息
        trim: true, // 自动取出前后空格
        minlength: 3, // 字符串最小长度
        maxlength: 20 // 字符串最大长度
    },
    email: {
        type: String,
        required: true,
        unique: true, // 唯一索引
        // 自定义异步校验
        validate: {
            // 传进去的value就是即将保存的email字符串
            validator: async function(value) {
                // 去查数据库中有没有这条email的记录
                const count = await this.constructor.countDocuments({email: value});
                return count === 0;
            },
            message: "该邮箱已被注册过"
        }
    },
    phone: {
        type: String,
        unique: true,
        sparse: true // 稀疏索引
    },
    age: {
        type: Number,
        min: 18, // 最小18
        max: 100 // 最大100
    },
    role: {
        type: String,
        enum: ['admin', 'user'], // 只能是这两个值其中之一
        default: 'user' // 默认值
    },
    website: {
        type: String,
        match: /^https?:\/\// // 正则，必须以http或者https开头
    }
},{
    // 全局配置选项
    timestamps: true // 自动生成createdAt和updatedAt字段
});

// 复核索引只能写在schema实例上
userSchema.index({role: 1, age: -1});

// 唯一符合索引
userSchema.index({username: 1, website: 1}, {unique: true});

// 将规则编译成具有数据库操作能力的实体类
const User = mongoose.model('User',userSchema, {collection: "users"});
module.exports = User;