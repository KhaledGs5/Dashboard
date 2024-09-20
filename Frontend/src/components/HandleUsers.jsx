import React, { useState, useEffect } from 'react';
import { getCookie, deleteCookie, setCookie } from './Cookies';
import { Link , useNavigate  } from 'react-router-dom';
import axios from 'axios';
import AccountImg from '../assets/Account.png';
import Logout from '../assets/Logout.png'
import Adduser from '../assets/Adduser.png'
import Editusers from '../assets/Editusers.png'
import Deleteuser from '../assets/Deleteuser.png'

const HandleUsers = () => {
    const user = getCookie('user');
    const navigate = useNavigate ();
    const [deleted, setDeleted] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/app/getall/')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the users!', error);
            });
    }, []);
    
    const handleLogout = () => {
        window.location.replace('/login'); 
        deleteCookie('user');
    };

    const handleEditAccount = (userid) => {
        setCookie('edituserid', userid , 5);
        if(userid === user['id']){
            navigate('/account/confirm');
        }else{
            navigate('/account/edituser');
        }
    };

    const handleDeleteAccount = async (userid) => {
        const EnteredData = { userid : userid };

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

    if(deleted){
        window.location.reload();
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
                        <button className="flex justify-start items-center w-full h-10 px-3 py-6 rounded-2xl  hover:border-2 border-indigo-300"  onClick={() => handleEditAccount(user['id'])}>
                            <img src={AccountImg} alt="Account :" className="w-5 h-5 mr-3"/>
                            <div className="">Edit Profile</div>
                        </button>
                        {user['is_admin'] ? 
                        <div className="flex flex-col items-start space-y-5">
                            <button className="flex justify-start items-center w-full h-10 px-3 py-6 rounded-2xl border-2 border-indigo-300" onClick={handleUsers}>
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
                        <button className="flex justify-start items-center w-full h-10 px-3 py-6 rounded-2xl  hover:border-2 border-red-300" onClick={() => handleDeleteAccount(user['id'])}>
                            <img src={Deleteuser} alt="Delete :" className="w-5 h-5 mr-3"/>
                            <div className="">Delete Account</div>
                        </button>
                    </div>
                    <div className="w-9/12 custom-min-h px-10 py-10 bg-white border-l-2 border-s-slate-100 rounded-r-lg">
                        <div className= "flex flex-col justify-center items-center w-4/5 px-10 py-10 bg-white rounded-md border-2 border-slate-50">
                            <h1 className="mb-5 text-lg">Users List</h1>
                            <ul className="flex flex-col justify-center items-center w-full border-2 rounded-md divide-y-2 divide-gray-200">
                                {users.map(user => (
                                    !user.is_admin ? (
                                        <li key={user.id} className="flex flex-row justify-start items-center w-full p-3 divide-x-2 divide-gray-200">
                                            <div className="w-3/12"> 
                                                {user.username}
                                            </div>
                                            <div className="pl-5 w-5/12">
                                                {user.email}
                                            </div>
                                            <button className="rounded-lg bg-indigo-700 w-2/12 h-12 hover:bg-indigo-500 text-white py-1 mr-3" onClick={() => handleEditAccount(user.id)}>Edit</button>
                                            <button className="rounded-lg bg-red-700 w-2/12 h-12 hover:bg-red-500 text-white py-1" onClick={() => handleDeleteAccount(user.id)}>Delete</button>
                                        </li>
                                    ) : null
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HandleUsers;
