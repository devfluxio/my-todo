const mongoose = require('mongoose');
const todoSchema = new mongoose.Schema(
    {
        todo: {
            type: String,
            required: true
        },
          ipAddress: {
            type: String,
            required: true

        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;