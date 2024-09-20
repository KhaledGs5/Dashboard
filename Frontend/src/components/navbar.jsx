import React from 'react';
import { Link } from 'react-router-dom';
import { getCookie , deleteCookie } from './Cookies';
import AccountImg from '../assets/Account.png';
import LoginImg from '../assets/Login.png';
import LogoutImg from '../assets/Logout.png';


const Navbar = () => {
    
    const user = getCookie('user');
    let username = '';
    if(user){
        username = user['username'];
    }else{
        username = '';
    }
    

    const HandleLogout = () => {
        window.location.replace('/login'); 
        deleteCookie('user');
        ResetCursor();
    };

    const ResetCursor = () => {
        document.body.style.cursor = 'default';
    };

    return (
        <nav className="bg-gray-100 shadow-md h-16 flex items-center">
            <div className="container mx-auto flex justify-between items-center">
                <Link className="text-lg font-semibold ml-5" to={user ? "/projects" : "/"} onClick={ResetCursor}>AutoDash System</Link>
                <div className="space-x-4">
                    {(!user) ? 
                    <Link className="flex flex-row justify-center items-center w-auto h-12 p-3 border-0 border-indigo-500 rounded-3xl mr-10 hover:border-2" to="/login">
                        <img src={LoginImg} alt="Login :" className="w-5 h-5 mr-3"/>
                        <div className="text-gray-700 text-lg" >Login</div>
                    </Link>
                    : 
                    <div className="flex justify-between items-center w-auto">
                        <Link className="flex flex-row justify-center items-center w-auto h-12 p-3 border-0 border-indigo-500 rounded-3xl mr-10 hover:border-2"  to="/account" onClick={ResetCursor}>
                            <img src={AccountImg} alt="Account :" className="w-5 h-5 mr-3"/>
                            <div className="text-gray-700 text-lg">{username}</div>
                        </Link>
                        <Link className="flex flex-row justify-center items-center w-auto h-12 p-3 border-0 border-red-400 rounded-3xl mr-10 hover:border-2" onClick={HandleLogout}>
                            <img src={LogoutImg} alt="Logout :" className="w-5 h-5 mr-3"/>
                            <div className="text-gray-700 text-lg">Logout</div>
                        </Link>
                    </div>
                    }
                </div>
            </div>
        </nav>
    );
    
};

export default Navbar;
