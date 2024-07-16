import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import email_icon from '../Pictures/email_icon.png';
import pass_icon from '../Pictures/user_icon.png';
import screen from '../Pictures/screen.jpg';
import '../Styles/LoginSignup.css';

const Login = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        const loginUser = {
            email,
            password
        };
        try {
            const res = await axios.get('http://localhost:8000/account/get/', {params: loginUser});
            console.log(res.data);
            if (res.data) {
                setLoggedIn(true); 
                localStorage.setItem('user', JSON.stringify(res.data));
              }
        } catch (err) {
            alert("Wrong email or password");
            console.log(err);
        }
    };

    if (loggedIn) {
        return <Navigate to='/dashboard' />; 
    }
        
    return (
        <div className="signup-container">
        <div className="imgBx">
           <img src={screen} />
        </div>
        <div className="container">
            <div className="header">
                <h2>Login</h2>
                <p className="text">Enter your credentials</p>
            </div>
            <form onSubmit={onSubmit}>
                <div className="inputs">
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
                </div>
                <div className="input">
                    <img src={pass_icon} alt="" />
                    <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
                </div>
                </div>
                <div className="button-container">
                <button type="submit" className="submit-button">Login</button>
                </div>
                <p className="have-account">Don't have an account ? <Link to='/signup'>Sign Up</Link></p>
                <p className="have-account">Forget your password ? <Link to='/reset'>Reset Password</Link></p>
            </form>
        </div>
        </div>
    );
};

export default Login;
