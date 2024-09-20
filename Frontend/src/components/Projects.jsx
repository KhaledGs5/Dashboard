import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCookie , setCookie , deleteCookie} from './Cookies';


const Projects = () => {

  const user = getCookie('user');

  const [panelData, setpanelData] = useState({
    panelname : ''
  });

  const onChange = e => setpanelData({...panelData, [e.target.name]: e.target.value });

  const {panelname} = panelData;

  const [panels , setPanels] = useState([]);

  const [showProjects, setShowProjects] = useState(false);

  const [panelDeleted, setPanelDeleted] = useState(false);

  const navigate = useNavigate();

  const HandleAddPanel = async (e) => {
    e.preventDefault();
    const EnteredData = {
      panelname,
      userid : user['id']
    }
    
    try {
      const res = await axios.post('http://localhost:8000/app/addproj/', EnteredData);
      if (res.status === 201) {  
        handleEditProject(res.data.id,panelname,user['username']);
      }
    } catch (err) {
        alert("Project Exist !!!");
        console.log(err);
    } 
  };

  const HandleOpenProjects = async (e) => {
    e.preventDefault();
    const enteredData = {
      userid: user['id'],
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
    setShowProjects(true);
  };

  const HandleReturn = () => {
    setShowProjects(false);
  };

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

  const ViewUsersProjects = () => {
    navigate("/projects/usersprojects");
  };

  if(panelDeleted){
    window.location.reload();
  }
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
          {!showProjects ? (
            <div className= "flex flex-row justify-start items-center w-3/5 h-auto bg-white rounded-lg border-2 border-slate-50 gap-y-5 p-10">
              <div className= "flex flex-col justify-center items-center w-3/5 h-auto gap-y-5 p-10">
                <label htmlFor="name" className="font-medium text-lg w-full">Create New Project :</label>
                <input
                className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-gray-50" 
                type="text" id="panelname" name="panelname" value={panelname} onChange={onChange} placeholder="Enter Project Name"/>
                <button className="rounded-lg bg-indigo-700 hover:bg-indigo-500 text-white py-1 w-6/12 h-12" onClick={HandleAddPanel}>Add Project</button>
              </div>
              <div className="flex flex-col justify-center items-start h-auto w-3/12 gap-y-5">
                <button className="rounded-lg bg-slate-700 hover:bg-slate-500 text-white py-1 w-full h-12 ml-16" onClick={HandleOpenProjects}>Open Projects</button>
                {user['is_admin'] ? <button className="rounded-lg bg-slate-700 hover:bg-slate-500 text-white py-1 w-full h-12 ml-16" onClick={ViewUsersProjects}>Show Users Projects</button> : null }
              </div>
            </div>
            ):
            <div className= "flex flex-row justify-start items-start w-3/5 h-auto bg-white rounded-lg border-2 border-slate-50 gap-y-5 p-10">
              <div className= "flex flex-col justify-center items-center w-4/5 px-10 py-10 bg-white rounded-md border-2 border-slate-50">
                  <h1 className="mb-5 text-lg">Projects List</h1>
                  <ul className="flex flex-col justify-center items-center w-full border-2 rounded-md divide-y-2 divide-gray-200">
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
              <button className="rounded-lg bg-slate-700 sticky top-96 hover:bg-slate-500 text-white py-1 w-4/12 h-12 ml-16 " onClick={HandleReturn}>Create New Project</button>
            </div>
          }
      </div> 
    </>
  );
};

export default Projects;
