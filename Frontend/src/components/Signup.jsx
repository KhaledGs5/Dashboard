import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import user_icon from '../Pictures/user_icon.png';
import email_icon from '../Pictures/email_icon.png';
import pass_icon from '../Pictures/pass_icon.png';
import screen from '../Pictures/screen.jpg';
import '../Styles/LoginSignup.css';

const Signup = () => {
    const [accountCreated, setAccountCreated] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        userName: '',
        password: '',
    });

    const { email, userName, password} = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
            const newUser = {
                email,
                username: userName,
                password, 
            };
            const user = JSON.parse(localStorage.getItem('user'));
            console.log(user['is_admin']);
            if(user['is_admin']){
                try {
                    const res = await axios.post('http://localhost:8000/account/add/', newUser);
                    console.log(res.data);
                    setAccountCreated(true);
                } catch (err) {
                    console.log(err);
                }
            }else{
                alert("You are not authorized to create accounts.");
            }
    };

    if (accountCreated) {
        return <Navigate to='/login' />;
    }

    return (
        <div className="signup-container">
            <div className="imgBx">
            <img src={screen} />
            </div>
            <div className="container">
                <div className='header'>
                    <h2>Register</h2>
                    <p className="text" >Create your Account</p>
                </div>
                <form onSubmit={onSubmit}>
                    <div className="inputs">
                    <div className="input">
                        <img src={email_icon} alt="" />
                        <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required  />
                    </div>
                    <div className="input">
                        <img src={user_icon} alt="" />
                        <input type="text" name="userName" value={userName} onChange={onChange} placeholder="UserName" required />
                    </div>
                    <div className="input">
                        <img src={pass_icon} alt="" />
                        <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
                    </div>
                    </div>
                    <div className="button-container">
                    <button type="submit" className="submit-button">Register</button>
                    </div>
                    <div className="have-account"> Already have an account ? <Link to='/login'>Login</Link></div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
