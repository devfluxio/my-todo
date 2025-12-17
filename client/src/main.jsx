import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter, Route,Routes} from 'react-router-dom';
import Home from './Components/Home.jsx';
import Addtodo from './Components/Addtodo.jsx';
import Navbar from './Components/Navbar.jsx';
import Songs from './Components/Songs.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
 <Navbar/>
  <Routes>
     {/* <Navbar> */}
    <Route path='/' element={<Home/>}/>
    <Route path='/addtodo' element={<Addtodo/>}/>
    <Route path='/songs' element={<Songs/>}/>
    {/* </Navbar> */}
  </Routes>
  
  </BrowserRouter>
  </StrictMode>,
)
