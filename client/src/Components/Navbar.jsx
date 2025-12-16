import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Navbar.css';



const Navbar = () => {
    const [toggle, setToggle] = useState(false);
    return <div className="Navbar">
        <div className="nav-content">
            <h3>MyTodo</h3>
            {
                toggle ?
                    <Link to='/' onClick={() => setToggle(!toggle)} className="nav-btn">Home</Link> :
                    <Link to='/addtodo' onClick={() => setToggle(!toggle)} className="nav-btn">Add Todo</Link>
            }
        </div>




    </div>;
}

export default Navbar;