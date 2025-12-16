const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./db/config');
connectDB();
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
const Todo = require('./db/todo');
PORT = process.env.PORT || 5001;

app.post('/addtodo',(req,resp)=>{
    console.log("Received a request to add todo",req.body);
    const {todo} = req.body;
    const todoItem = new Todo({ todo})
    todoItem.save().then(()=>{
        resp.status(201).json({message:"Todo added successfully"});
    }).catch((err)=>{
        resp.status(500).json({message:"Error adding todo", error: err});
    });
})

app.get('/gettodos', (req, resp) => {
    Todo.find().then((todos) => {
        resp.status(200).json(todos);   

    }).catch((err) => {
        resp.status(500).json({ message: "Error fetching todos", error: err });
    }   
    );
}   );

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})