const DataError = require("../errors/DataError");

async function create(model, data) {
    try {
        return await model.create(data);
    } catch (error) {
        console.log("【mongo】",error)
        throw new DataError(DataError.MONGO_ERROR_CODE, "Mongo插入数据失败");
    }
}

async function findOne(model, query) {
    try {
        return await model.findOne(query);
    } catch (error) {
        throw new DataError(DataError.MONGO_ERROR_CODE, "Mongo查找单个文档失败");
    }
}

async function findAll(model, query) {
    try {
        return await model.find(query);
    } catch (error) {
        throw new DataError(DataError.MONGO_ERROR_CODE, "Mongo查找所有文档失败");
    }
}

async function updateOne(model, query, data) {
    try {
        return await model.findOneAndUpdate(query, data, {new: true, runValidators: true});
    } catch (error) {
        throw new DataError(DataError.MONGO_ERROR_CODE, "Mongo更新单个文档失败");
    }
}

async function deleteOne(model, query) {
    try {
        await model.deleteOne(query);
    } catch (error) {
        throw new DataError(DataError.MONGO_ERROR_CODE, "Mongo删除单个文档失败");
    }
}

module.exports = {
    create,
    findOne,
    findAll,
    updateOne,
    deleteOne
};