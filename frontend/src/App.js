import './stylesheets/App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Post from './pages/post';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/post/:id' element={<Post />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;