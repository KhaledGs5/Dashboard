import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import email_icon from '../Pictures/email_icon.png';
import '../Styles/LoginSignup.css';

const Reset = () => {
    const [emailSent, setEmailSent] = useState(false);
    const [formData, setFormData] = useState({
        email: ''
    });

    const { email } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        const resetRequest = {
            
        };
        try {
            const res = await axios.put('http://localhost:8000/account/reset-password/',{params: resetRequest});
            console.log(res.data);
            setEmailSent(true);
        } catch (err) {
            console.log(err);
        }
    };

    if (emailSent) {
        return <Navigate to='/login' />;
    }

    return (
        <div className="signup-container" style ={{width : '60%'}}>
            <div className="container" style ={{width : '100%'}}>
              <div className="header">
                <h2>Reset Password</h2>
                <p className="text">Enter your email to reset your password :</p>
              </div>
              <form onSubmit={onSubmit}>
                    <div className="inputs">
                        <div className="input">
                                <img src={email_icon} alt="email icon" />
                                <input type="email" name="email" value={email} onChange={onChange} required />
                        </div>
                        <div className="button-container">
                            <button type="submit" className="submit-button" style ={{width : '200px'}}>Send Reset Link</button>
                        </div>
                    </div>
              </form>
            </div>
        </div>   
    );
};
export default Reset;