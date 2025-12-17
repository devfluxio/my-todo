import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Navbar.css';



const Navbar = () => {
    const [toggle, setToggle] = useState(false);
    const [toggle2, setToggle2] = useState(false);
    return <div className="Navbar">
        <div className="nav-content">
            <h3>MyTodo</h3>
            <div>
               
                {
                    toggle2?
                     <Link to='/' onClick={() => setToggle2(!toggle2)} className="nav-btn">Home</Link>:
                      <Link to='/songs' onClick={() => setToggle2(!toggle2)} className="nav-btn">Songs</Link>

                }
                {
                    toggle ?
                        <Link to='/' onClick={() => setToggle(!toggle)} className="nav-btn">Home</Link> :
                        <Link to='/addtodo' onClick={() => setToggle(!toggle)} className="nav-btn">Add Todo</Link>
                }
            </div>

        </div>




    </div>;
}

export default Navbar;