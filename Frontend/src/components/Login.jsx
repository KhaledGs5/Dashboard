import React, { useState } from 'react';
import axios from 'axios';
import { setCookie } from './Cookies';

const Login = () => {
    const [rememberMe, setRememberMe] = useState(false);
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
            const res = await axios.get('http://localhost:8000/app/get/', {params: loginUser});
            if (res.data) {
                if(rememberMe) {
                    setCookie('user', res.data , 5);
                }else{
                    setCookie('user', res.data);
                }
                window.location.replace('/projects'); 
            }
        } catch (err) {
            alert("Wrong email or password");
            console.log(err);
        }
    };

    const RememberState = (e) => {
        setRememberMe(e.target.checked);
    };
        
    return (
        <div className="flex justify-center items-center h-auto mt-10">
            <div className= "w-2/5 px-10 py-20 shadow-lg bg-white rounded-md">
                <h1 className="text-3xl text-center font-semibold"><i className="fa-solid fa-user"></i> Login to your account </h1>
            <form onSubmit={onSubmit}>
                <div className="mt-8">
                    <div>
                    <label htmlFor="email" className="font-medium text-lg">Email :</label>
                    <input 
                       className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-gray-50"
                       type="email" id="email" name="email" value={email} onChange={onChange} placeholder="Enter your Email" required />
                    </div>
                    <div className="mt-4">
                    <label htmlFor="psw" className="font-medium text-lg">Password :</label>
                    <input
                      className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-gray-50" 
                      type="password" id="psw" name="password" value={password} onChange={onChange} placeholder="Enter your Password" required />
                    </div>
                </div>
                <div className="mt-4">
                    <input type="checkbox" id="remember" checked={rememberMe} onChange={RememberState}/><label htmlFor="remember" className=" ml-2 font-medium text-base">Remember Me</label>
                </div>
                <div className="mt-10 w-full flex justify-center">
                    <button type="submit" className="rounded-lg bg-indigo-700 hover:bg-indigo-500 text-white py-1 w-3/5 h-12">Login</button>
                </div>
            </form>
            </div>
        </div>
    );
};

export default Login;
