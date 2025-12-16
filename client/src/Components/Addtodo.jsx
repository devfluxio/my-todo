import './Addtodo.css';
import { useState,useEffect } from 'react';
const Addtodo = () => {
    const [todo, setTodo] = useState("");
    console.log(todo);
    const BASE_URL=import.meta.env.VITE_API_URL;

    const sendData=(e)=>{
        e.preventDefault();
        if(!todo) return;
        fetch(`${BASE_URL}/addtodo`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ todo } )
        });

    }

    return <div className="todo-container">
        <div className="todo-box">
            <h1>Todo</h1>
            <textarea placeholder="Add your todo here" value={todo} onChange={(e) => setTodo(e.target.value)}></textarea>
            <button className='btn' onClick={sendData}>Add Todo</button>
        </div>
    </div>;


};

export default Addtodo;
