import React, { useState, useEffect } from 'react';
import { getCookie, deleteCookie , setCookie} from './Cookies';
import { Link , useNavigate  } from 'react-router-dom';
import axios from 'axios';
import AccountImg from '../assets/Account.png';
import Logout from '../assets/Logout.png'
import Adduser from '../assets/Adduser.png'
import Editusers from '../assets/Editusers.png'
import Deleteuser from '../assets/Deleteuser.png'

const Account = () => {
    const user = getCookie('user');
    const navigate = useNavigate ();

    const [deleted, setDeleted] = useState(false);

    const [panelDeleted, setPanelDeleted] = useState(false);

    const [panels , setPanels] = useState([]);

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
    useEffect(() => {
        const fetchData = async () => {
            const enteredData = {
                userid: user.id,
            };
    
            try {
                const res = await axios.get('http://localhost:8000/app/getpanels/', { params: enteredData });
                if (res.data) {
                    setPanels(res.data);
                }
            } catch (err) {
                alert("There is no Projects !!!!\n Create New Project");
                console.log(err);
            }
        };

        fetchData();
    }, [user.id]);

    const handleEditProject = (panelid,panelname,username) => {
        const panelData = {
          panelid: panelid,
          panelname:panelname,
        };
        setCookie('panelData', panelData, 5);
        setCookie('ownerName', username, 5);
        console.log('Editing project with id:', panelid);
        navigate("/dashboard");
      };
    
      const handleDeleteProject = async (panelid) => {
        const enteredData = {
          panelid: panelid,
        };
    
        try {
          const res = await axios.delete('http://localhost:8000/app/delpanel/', { params: enteredData });
          if (res.status === 204) {
            setPanelDeleted(true);
            deleteCookie('panelData');
          }
        } catch (err) {
          alert("There is no Projects !!!!\n Create New Project");
          console.log(err);
        }
    };

    const AddProjects = () => {
        navigate("/projects");
      };

    if(panelDeleted){
        window.location.reload();
    }

    const navbarHeight = '144px';

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
                        <button className="flex justify-start items-center w-full h-10 px-3 py-6 rounded-2xl  hover:border-2 border-indigo-300"  onClick={() => handleEditAccount(user['id'])}>
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
                    <div className="flex flex-col items-start w-9/12 custom-min-h px-10 py-10 bg-white border-l-2 border-s-slate-100 rounded-r-lg gap-y-10">
                        <div className="flex justify-start items-center gap-x-7 w-4/5">
                            <div className="flex justify-center items-center w-40 h-40 bg-white border-2 border-slate-300 rounded-full">
                                <img src={AccountImg} alt="Account :" className="w-32 h-32 rounded-full"/>
                            </div>
                            <div className="flex flex-col items-start">
                                <div className='text-lg'>{user['username']}</div>
                                <div className='text-sm text-slate-400'>Edit your profile</div>
                            </div>
                            <button className="rounded-lg bg-slate-700 hover:bg-slate-500 text-white py-1 w-32 h-12 ml-16" onClick={AddProjects}>
                                Add Project
                            </button>
                        </div>
                        <div className="flex justify-start items-center gap-x-7">
                            <div className="flex flex-row items-start gap-x-40">
                                <div className="flex flex-col items-start">
                                    <span className="text-md text-slate-400">Name :</span><div className='ml-3 text-base'>{user['username']}</div>
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="text-md text-slate-400">Email :</span><div className='ml-3 text-base'>{user['email']}</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-start items-center gap-x-7 w-3/5">
                            <div className="flex flex-col items-start justify-center w-full">
                                <span className="text-md text-slate-400">Projects :</span>
                                <ul className="flex flex-col justify-center items-center w-full border-2 rounded-md divide-y-2 divide-gray-200 mt-5">
                                    {panels.map(panel => (
                                        <li key={panel.id} className="flex flex-row justify-start items-center w-full p-3">
                                            <div className="w-6/12"> 
                                                {panel.panelname}
                                            </div>
                                            <button className="rounded-lg bg-indigo-700 w-3/12 h-12 hover:bg-indigo-500 text-white py-1 mr-3" onClick={() => handleEditProject(panel.id, panel.panelname, user['username'])}>Open</button>
                                            <button className="rounded-lg bg-red-700 w-3/12 h-12 hover:bg-red-500 text-white py-1" onClick={() => handleDeleteProject(panel.id)}>Delete</button>
                                        </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Account;
