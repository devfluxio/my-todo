import { useState,useEffect } from "react";
import './Home.css';
const Home = () => {
    const [todos, setTodos] = useState([]);
    console.log(todos);
    const BASE_URL=import.meta.env.VITE_API_URL;
    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await fetch(`${BASE_URL}/gettodos`);
            const data = await response.json();
            setTodos(data);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    return <div>
        <div className="todo-container-1">
            {todos.map((item) => (
                <div key={item._id} className="todo-box-1" >
                    <p>{item.todo}</p>    
                </div>
            ))}
        </div>
    </div>;     


};

export default Home;