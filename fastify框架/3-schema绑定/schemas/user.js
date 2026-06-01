// schemas/user.js
// 用一个user.js管理所有和user相关的schema

const createUserSchema = {
    body: {
        type: 'object',
        required: ['name', 'age', 'email'],
        additionalProperties: false,
        properties: {
            name:  { type: 'string', minLength: 2, maxLength: 20 },
            age:   { type: 'integer', minimum: 0, maximum: 150 },
            email: { type: 'string', format: 'email' }
        }
    },
    response: {
        201: {
            type: 'object',
            properties: {
                id:    { type: 'integer' },
                name:  { type: 'string' },
                email: { type: 'string' }
            }
        }
    }
};

const getUserSchema = {
    params: {
        type: 'object',
        properties: {
            id: { type: 'integer' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id:    { type: 'integer' },
                name:  { type: 'string' },
                email: { type: 'string' }
            }
        }
    }
};

module.exports = { createUserSchema, getUserSchema };