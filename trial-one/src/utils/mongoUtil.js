const DataError = require("../errors/DataError");

async function create(model, data) {
    try {
        return await model.create(data);
    } catch (error) {
        throw new DataError(DataError.MONGO_ERROR_CODE, error.message);
    }
}

async function findOne(model, query) {
    try {
        return await model.findOne(query);
    } catch (error) {
        throw new DataError(DataError.MONGO_ERROR_CODE, error.message);
    }
}

async function findAll(model, query) {
    try {
        return await model.find(query);
    } catch (error) {
        throw new DataError(DataError.MONGO_ERROR_CODE, error.message);
    }
}

async function updateOne(model, query, data) {
    try {
        return await model.findOneAndUpdate(query, data, {new: true, runValidators: true});
    } catch (error) {
        throw new DataError(DataError.MONGO_ERROR_CODE, error.message);
    }
}

async function deleteOne(model, query) {
    try {
        await model.deleteOne(query);
    } catch (error) {
        throw new DataError(DataError.MONGO_ERROR_CODE, error.message);
    }
}

module.exports = {
    create,
    findOne,
    findAll,
    updateOne,
    deleteOne
};