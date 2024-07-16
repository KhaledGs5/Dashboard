import React from 'react';
import back from '../Pictures/background.jpg';
import '../Styles/Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
      <div className="home-container">
      <h1>Welcome to AutoDash System</h1>
      <div className="home-btn">
        <button style={{left : '80%'}}><Link to='/login'>Login</Link></button>
        <button style={{left : '85%'}}><Link to='/signup'>Sign Up</Link></button>
      </div>
      </div>
  );
}

export default Home;
