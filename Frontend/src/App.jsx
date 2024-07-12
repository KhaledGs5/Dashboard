import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Navbar from './components/navbar';
import Home from './components/home';
import './index.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div class="cont">
      <div className="container">
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
      </div>
      </div>  
    </Router>
  );
}

export default App;


