import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {  setCookie } from './Cookies';


function UsersProjects() {

    const [users, setUsers] = useState([]);
    const [panels, setPanels] = useState({});

    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchUsersAndPanels = async () => {
        try {

          const usersResponse = await axios.get('http://localhost:8000/app/getall/');
          const usersData = usersResponse.data;
          setUsers(usersData);

          const panelsData = {};
          for (const user of usersData) {
            const res = await axios.get('http://localhost:8000/app/getpanels/', { params: { userid: user.id } });
            panelsData[user.id] = res.data;
          }
          setPanels(panelsData);
        } catch (error) {
          console.error('There was an error fetching the data!', error);
          alert("There was an error fetching the data!");
        }
      };
  
      fetchUsersAndPanels();
    }, []);

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


    const navbarHeight = '64px';

    return (
        <>
        <style>
            {`
                .custom-min-h {
                    min-height: calc(100vh - ${navbarHeight});
                }
            `}
        </style>
        <div className="flex justify-center items-center w-screen custom-min-h relative p-10">
            <div className="flex justify-center items-center w-3/5 h-auto bg-white rounded-lg border-2 border-slate-50 gap-y-5 p-10">
                <div className="flex flex-col justify-start items-center w-4/5 h-auto rounded-lg border-2 border-slate-200 divide-y-2 divide-gray-200">
                    {users.map(user => (
                        !user.is_admin ? (
                            <div key={user.id} className="flex justify-center items-center w-full p-3 divide-x-2 divide-gray-200">
                                <div className="w-3/12">
                                    {user.username}
                                </div>
                                <div className="pl-5 w-9/12 flex justify-start items-center gap-x-5">
                                    {panels[user.id] ? panels[user.id].map(panel => (
                                        <button key={panel.id} className="font-bold" onClick={() => handleEditProject(panel.id, panel.panelname,user.username)}>{panel.panelname}</button>
                                    )) : 'Loading panels...'}
                                </div>
                            </div>
                        ) : null
                    ))}
                </div>
            </div>
        </div>
        </>
    );
}

export default UsersProjects;
