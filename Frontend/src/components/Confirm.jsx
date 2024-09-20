import React, { useState } from 'react';
import { getCookie, deleteCookie , setCookie} from './Cookies';
import { Link , useNavigate  } from 'react-router-dom';
import axios from 'axios';
import AccountImg from '../assets/Account.png';
import Logout from '../assets/Logout.png'
import Adduser from '../assets/Adduser.png'
import Editusers from '../assets/Editusers.png'
import Deleteuser from '../assets/Deleteuser.png'

const Confirm = () => {
    const user = getCookie('user');
    const navigate = useNavigate ();
    const [deleted, setDeleted] = useState(false);
    const [passData, setPassData] = useState({
        password: '',
        confirmPassword: ''
    });

    const { password, confirmPassword } = passData;

    const [confirmed ,setConfirmed] = useState(false);
    
    const onChange = e => setPassData({...passData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (password === confirmPassword) {
            try {
                const EnteredData = {
                    userid : getCookie('edituserid'),
                    password,
                };
                const res = await axios.get('http://localhost:8000/app/verf/', { params: EnteredData });
                if (res.data) {
                    setConfirmed(true);
                }
            } catch (err) {
                alert("Wrong password");
                console.log(err);
            }
        } else {
            alert("Passwords do not match");
        }
    };
    
    

    const handleLogout = () => {
        window.location.replace('/login'); 
        deleteCookie('user');
    };

    const handleEditAccount = (userid) => {
        setCookie('edituserid', userid , 5);
        navigate('/account/confirm');
    };

    const handleDeleteAccount = async () => {
        const EnteredData = { userid : user['id'] };

        try {
            const res = await axios.delete('http://localhost:8000/app/delete/',{params : EnteredData});
            if (res.status === 204) {  
                setDeleted(true);
            }
        } catch (err) {
            alert("Something Wrong !!!");
            console.log(err);
        } 
    };

    const handleUsers = () => {
        navigate('/account/handleusers');
    }

    const navbarHeight = '144px';

    if(confirmed){
        navigate('/account/edituser');
    }

    if(deleted){
        deleteCookie('user');
        navigate('/login');
    }

    return (
        <>
            <style>
                {`
                    .custom-min-h {
                        min-height: calc(100vh - ${navbarHeight});
                    }
                `}
            </style>
            <div className="flex justify-center items-center h-auto p-10">
                <div className="flex justify-start h-auto w-full shadow-lg">
                    <div className="w-3/12 custom-min-h px-10 py-10  bg-white rounded-l-lg space-y-5">
                        <Link className="text-lg text-slate-400 mb-10" to="/account">Profile</Link>
                        <button className="flex justify-start items-center w-full h-10 px-3 py-6 rounded-2xl border-2 border-indigo-300"  onClick={() => handleEditAccount(user['id'])}>
                            <img src={AccountImg} alt="Account :" className="w-5 h-5 mr-3"/>
                            <div className="">Edit Profile</div>
                        </button>
                        {user['is_admin'] ? 
                        <div className="flex flex-col items-start space-y-5">
                            <button className="flex justify-start items-center w-full h-10 px-3 py-6 rounded-2xl  hover:border-2 border-indigo-300" onClick={handleUsers}>
                                <img src={Editusers} alt="Edit :" className="w-5 h-5 mr-3"/>
                                <div className="">Edit Users</div>
                            </button>
                            <Link className="flex justify-start items-center w-full h-10 px-3 py-6 rounded-2xl  hover:border-2 border-indigo-300" to="/signup">
                                <img src={Adduser} alt="Add :" className="w-5 h-5 mr-3"/>
                                <div className="">Add User</div>
                            </Link>
                        </div>
                        : null }
                        
                        <button className="flex justify-start items-center w-full h-10 px-3 py-6 rounded-2xl  hover:border-2 border-red-300" onClick={handleLogout}>
                            <img src={Logout} alt="Account :" className="w-5 h-5 mr-3"/>
                            <div className="">Log Out</div>
                        </button>
                        <button className="flex justify-start items-center w-full h-10 px-3 py-6 rounded-2xl  hover:border-2 border-red-300" onClick={handleDeleteAccount}>
                            <img src={Deleteuser} alt="Delete :" className="w-5 h-5 mr-3"/>
                            <div className="">Delete Account</div>
                        </button>
                    </div>
                    <div className="w-9/12 custom-min-h px-10 py-10 bg-white border-l-2 border-s-slate-100 rounded-r-lg">
                        <div className= "w-2/5 px-10 py-5 bg-white rounded-lg border-2 border-slate-50">
                            <form onSubmit={onSubmit}>
                                <div className="">
                                    <div>
                                    <label htmlFor="psw" className="font-medium text-lg">Password :</label>
                                    <input
                                    className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-gray-50" 
                                    type="password" id="psw" name="password" value={password} onChange={onChange} placeholder="Enter your Password" required />
                                    </div>
                                    <div className="mt-4">
                                    <label htmlFor="conpsw" className="font-medium text-lg">Confirm Password :</label>
                                    <input 
                                    className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-gray-50"
                                    type="password" id="conpsw" name="confirmPassword" value={confirmPassword} onChange={onChange} placeholder="Re-Enter your Password" required />
                                    </div>
                                </div>
                                <div className="mt-10">
                                    <button type="submit" className="rounded-lg bg-indigo-700 hover:bg-indigo-500 text-white py-1 w-full h-12">Confirm</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Confirm;
