// node模块缓存机制，拿到的mongoose是单例的
// node第一次require一个文件时会执行并缓存结果
// 后续再require同一个文件直接返回缓存
const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    apikey: {
        type: String,
        required: [true, "apikey必传"],
        trim: true
    },
    deviceid: {
        type: String,
        required: [true, "deviceid必传"],
        trim: true
    },
    online: {
        type: Boolean,
        required: [true, "online必传"]
    },
    state: {
        type: Object,
        required: [true, "Object必传"],
    }
});

deviceSchema.index({deviceid: 1}, {unique: true});
deviceSchema.index({apikey: 1})

const device = mongoose.model('Device', deviceSchema, "devices");
module.exports = device;