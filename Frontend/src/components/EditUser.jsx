import React, { useState, useEffect } from 'react';
import { getCookie, deleteCookie, setCookie } from './Cookies';
import { Link , useNavigate  } from 'react-router-dom';
import axios from 'axios';
import AccountImg from '../assets/Account.png';
import Logout from '../assets/Logout.png'
import Adduser from '../assets/Adduser.png'
import Editusers from '../assets/Editusers.png'
import Deleteuser from '../assets/Deleteuser.png'

const EditUser = () => {
    const user = getCookie('user');
    const navigate = useNavigate ();
    const [deleted, setDeleted] = useState(false);
    const [userData, setuserData] = useState({
        email: '',
        username: '',
        password: '',
    });
    const [edituser, seteditUser] = useState([]);

    const [changed , setChanged] = useState(false);

    const { email, username ,password } = userData;
    
    const onChange = e => setuserData({...userData, [e.target.name]: e.target.value });


    useEffect(() => {
        const userid = getCookie('edituserid');

        axios.get('http://localhost:8000/app/getbyid/', {params : {userid: userid}})
            .then(response => {
                seteditUser(response.data);
            })
            .catch(error => {
                console.error('Error !!!!', error);
            });
    }, []);

    const onSubmit = async e => {
        e.preventDefault();
        const EnteredData = { userid : getCookie('edituserid') };

        if (email) EnteredData.email = email;
        if (username) EnteredData.username = username;
        if (password) EnteredData.password = password;

        try {
            const res = await axios.put('http://localhost:8000/app/put/',EnteredData);
            if(res.data){
                setChanged(true);
                if(edituser.id === user['id']){
                    setCookie('user', res.data, 5);
                }
            }
        } catch (err) {
            alert("Something Wrong !!!");
            console.log(err);
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

    if(changed){
        window.location.reload();
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
                        <div className= "flex flex-col justify-center items-center w-full px-10 py-10 bg-white rounded-md border-2 border-slate-50">
                            <h1 className="mb-5 text-lg">Edit User</h1>
                            <form className="flex flex-col justify-center items-center gap-y-5 w-full" onSubmit={onSubmit}>
                                <div className="flex flex-row justify-start items-center gap-x-10 w-full">       
                                    <label htmlFor="eml" className="font-medium text-lg w-1/12">Email :</label>
                                    <input
                                    className="w-5/12 border-2 border-gray-100 rounded-xl p-3 mt-1 bg-gray-50" 
                                    type="email" id="eml" name="email" value={email} onChange={onChange} placeholder="Enter the new Email"/>
                                    <label htmlFor="eml" className="font-medium text-lg w-2/12">Current Email :</label>
                                    <div className="w-4/12 border-2 border-gray-100 rounded-xl p-3 mt-1 bg-gray-50" >{edituser.email}</div>
                                </div>
                                <div className="flex flex-row justify-start items-center gap-x-10 w-full">
                                    <label htmlFor="name" className="font-medium text-lg w-1/12">Name :</label>
                                    <input
                                    className="w-5/12 border-2 border-gray-100 rounded-xl p-3 mt-1 bg-gray-50" 
                                    type="text" id="name" name="username" value={username} onChange={onChange} placeholder="Enter the new Username"/>
                                    <label htmlFor="eml" className="font-medium text-lg w-2/12">Current Name :</label>
                                    <div className="w-4/12 border-2 border-gray-100 rounded-xl p-3 mt-1 bg-gray-50" >{edituser.username}</div>
                                </div>
                                <div className="flex flex-row justify-start items-center gap-x-10 w-full">
                                    <label htmlFor="psw" className="font-medium text-lg w-1/5">Password :</label>
                                    <input
                                    className="w-5/12 border-2 border-gray-100 rounded-xl p-3 mt-1 bg-gray-50" 
                                    type="password" id="psw" name="password" value={password} onChange={onChange} placeholder="Enter the new Password"/>
                                </div>
                                <button type="submit" className="rounded-lg bg-indigo-700 w-2/5 h-12 hover:bg-indigo-500 text-white py-1 ">Confirm</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditUser;
