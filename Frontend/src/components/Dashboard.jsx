import React, { useState, useEffect } from 'react';
import AddcompImg from '../assets/Addcomp.png';
import ReturnImg from '../assets/Return.png';
import { getCookie,setCookie } from './Cookies';
import axios from 'axios';
import Gauge from './PanelComponents/Gauge';
import Temperature from './PanelComponents/Temperature';
import DeleteComp from '../assets/Deletecomp.png';
import DragImg from '../assets/Drag.png';
import Cursor from '../assets/Cursor.png';
import DragComp from '../assets/DragComp.png';
import Delete from '../assets/Delete.png';
import mqtt from 'mqtt';

function Dashboard() {
    const panel = getCookie('panelData');
    const ownerName = getCookie('ownerName');
    
    const [showSideBar, setShowSideBar] = useState(false);
    const navbarHeight = "64px";

    const ShowSideBar = () => {
        setShowSideBar(true);
    };

    const HideSideBar = () => {
        setShowSideBar(false);
    };

    const [cursorChoice , setCursorChoice] = useState("Cursor");

    const componentMap = {
        'Gauge': Gauge,
        'Temperature': Temperature,
    };

    const [draggedcompid , setDraggedCompid] = useState(0);

    const [isDragging, setIsDragging] = useState(false);

    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);

    const [compSelected, setCompSelected] = useState(false);

    
    let positionx = 0;
    let positiony = 0;

    const [components, setComponents] = useState([

    ]);

    const addComponent = (newComponent) => {
        setComponents(prevComponents => [...prevComponents, newComponent]);
    };

    const updateComponentPosition = (id, newPosX, newPosY) => {
        setComponents((prevComponents) =>
            prevComponents.map((component) =>
                component.id === id
                    ? { ...component, posx: newPosX, posy: newPosY }
                    : component
            )
        );
    };

    const deleteComponentById = (id) => {
        setComponents((prevComponents) =>
          prevComponents.filter((component) => component.id !== id)
        );
      };

    const getPositionById = (id) => {
        const component = components.find(component => component.id === id);
        return component ? { posx: component.posx, posy: component.posy } : null;
    };

    const handleCursorChoice = (choice) => {
        setCursorChoice(choice);
    };
    
    const cursorStyles = {
        default: 'default',
        Delete: `url(${Delete}), auto`,
        DragComp: `url(${DragComp}), auto`,
    };

    document.body.style.cursor = cursorStyles[cursorChoice] || 'default';

    const renderComponent = (component) => {
        const Component = componentMap[component.compname];
        return Component ? (
            <div
                key={component.id}
                id="draggable" 
                className={`absolute rounded-full ${(cursorChoice === 'Delete') ? 'hover:opacity-40 hover:bg-red-400' : ''}`} 
                style={{ 
                    left: component.posx, 
                    top: component.posy, 
                }}
                onMouseDown={(e) => handleMouseDown(e, component.id)}
            >
                <Component cursorChoice={cursorChoice} value={component.value} />
            </div>
        ) : null;
    };
    

    const handleMouseDown = async (e,id) => {
        e.preventDefault();
        if(cursorChoice === 'Delete'){
            const enteredData = {
                compid : id,
            };
            try {
                const res = await axios.delete('http://localhost:8000/app/delcomp/',{params : enteredData});
                if(res.status === 204){
                    deleteComponentById(id);
                };
            } catch (err) {
                alert("Something Wrong !!!");
                console.log(err);
            }
        }else{
            setDraggedCompid(id);
            setIsDragging(true);
            setCompSelected(true);
            const panelRect = document.getElementById('panel').getBoundingClientRect();
            const position = getPositionById(id);
            positionx = position.posx;
            positiony = position.posy;
            setOffsetX(e.clientX - panelRect.left - position.posx);
            setOffsetY(e.clientY - panelRect.top - position.posy);
        }
    };

    const handleGetComponent = async (e , compname) => {
        e.preventDefault();
        const newComponent = {
            compname: compname,
            posx: e.clientX,
            posy: e.clientY,
            value: 50,
            panelid: panel['panelid'],
        };

        try {
            const res = await axios.post('http://localhost:8000/app/addcomp/',newComponent);
            if (res.status === 201) {  
                addComponent(res.data);
                setDraggedCompid(res.data['id']);
            }
        } catch (err) {
            alert("Something Wrong !!!");
            console.log(err);
        }
        setCompSelected(true);
        setIsDragging(true);
        setCursorChoice('DragComp');
    }

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging && (cursorChoice === 'DragComp')) {
                const panelRect = document.getElementById('panel').getBoundingClientRect();
                const elementRect = document.getElementById('draggable').getBoundingClientRect();
                
                let x = e.clientX - panelRect.left - offsetX;
                let y = e.clientY - panelRect.top - offsetY;

                x = Math.max(0, Math.min(x, panelRect.width - elementRect.width));
                y = Math.max(0, Math.min(y, panelRect.height - elementRect.height));

                positionx = parseInt((Math.max(0, x)), 10);
                positiony = parseInt((Math.max(0, y)), 10);

                updateComponentPosition(draggedcompid, positionx, positiony);
            }
        };

        const handleMouseUp = async () => {
            setIsDragging(false);
            if(compSelected){
                setCompSelected(false);
                if (draggedcompid !== 0 && (cursorChoice === 'DragComp')) {
                    const newComponentPos = {
                        compid: draggedcompid,
                        posx: positionx,
                        posy: positiony,
                    };

                    try {
                        await axios.put('http://localhost:8000/app/updatecomp/', newComponentPos);
                    } catch (err) {
                        alert("Cannot update component!");
                        console.error(err);
                    }
                }
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, offsetX, offsetY ,draggedcompid]);


    useEffect(() => {
        const fetchComponents = async () => {
            const EneterdData = { panelid: panel['panelid'] };
            try {
                const res = await axios.get('http://localhost:8000/app/getcomps/', { params: EneterdData });
                if (res.status === 200) {
                    setComponents(res.data);
                }
            } catch (err) {
                alert("Cannot get components!");
                console.error(err);
            }
        };
        fetchComponents();
    }, []);


    const Tempclient = mqtt.connect("ws://localhost:4000");
    const Vitclient = mqtt.connect("ws://localhost:4000");

    Tempclient.subscribe("Temperature");
    Vitclient.subscribe("Vitesse");

    Tempclient.on("message", (topic, message) => {
        console.log(topic, message.toString());
    });
    Vitclient.on("message", (topic, message) => {
        console.log(topic, message.toString());
    });

    return (
        <>
            <style>
                {`
                    .custom-min-h {
                        min-height: calc(100vh - ${navbarHeight});
                    }
                    .work-min-h {
                        height: 100%;
                        flex-grow: 1;
                    }
                    .button-img {
                        opacity: 0;
                        transition: opacity 0.3s ease;
                    }
                    .button:hover .button-img {
                        opacity: 1;
                    }
                `}
            </style>
            <div className="flex flex-col justify-start items-center w-full custom-min-h">
                <div id="tools" className="flex flex-row justify-start items-center w-full h-16 border-2 border-slate-300 relative">
                    <div className="flex flex-col justify-center items-start w-auto h-full">
                        <div className="flex flex-row justify-start items-center w-full h-full">
                            <p className="text-lg text-indigo-800 font-bold ml-5">Project :</p>&nbsp;
                            <p className="text-lg text-black ">{panel['panelname']}</p>
                        </div>
                        <div className="flex flex-row justify-start items-center w-full h-full">
                            <p className="text-md text-slate-800 font-bold ml-5">Owner Name :</p>&nbsp;
                            <p className="text-md text-black ">{ownerName}</p>
                        </div>
                    </div>
                    <div className="flex flex-row w-52 justify-center items-center absolute right-5">
                        <button className="w-14 h-14 flex justify-center items-center ease-in duration-100 hover:w-16 hover:h-16" onClick={() => handleCursorChoice('default')}>
                            <img src={Cursor} alt="Cursor" className="w-3/5 h-3/5"/>
                        </button>
                        <button className="w-14 h-14 flex justify-center items-center ease-in duration-100 hover:w-16 hover:h-16" onClick={() => handleCursorChoice('DragComp')}>
                            <img src={DragImg} alt="Drag" className="w-3/5 h-3/5"/>
                        </button>
                        <button className="w-14 h-14 flex justify-center items-center ease-in duration-100 hover:w-16 hover:h-16" onClick={() => handleCursorChoice('Delete')}>
                            <img src={DeleteComp} alt="Delete" className="w-3/5 h-3/5"/>
                        </button>
                    </div>
                </div>
                <div className="flex flex-grow flex-row justify-start items-stretch w-full work-min-h relative">
                    <button 
                        id="components" 
                        className={`flex justify-center items-center w-10 h-10 rounded-full border-4 border-indigo-700 z-20 absolute top-5 cursor-default ease-in duration-100 hover:w-12 hover:h-12 ${showSideBar ? 'left-32 rotate-180 invisible' : 'visible left-5 rotate-0 hover:top-4 hover:left-4'}`} 
                        onClick={ShowSideBar}
                    >
                        <img src={AddcompImg} alt="add" className="w-6/12 h-6/12"/>
                    </button> 
                    <div id="side" className={`flex ease-in duration-200 absolute h-full border-2 border-slate-200 bg-slate-100 z-20 cursor-default ${isDragging ? 'opacity-40' : 'opacity-100'} ${showSideBar ? 'w-1/5 visible' : 'w-0 invisible'}`}>
                        <div className="flex flex-col justify-start items-center w-10/12">
                            {showSideBar ? <h1 className="mt-3 mb-5">Add Component</h1> : null}
                            {showSideBar ? 
                            <ul className="space-y-4 w-4/5">
                                <li >
                                    <button className="flex justify-center items-center w-full h-10 rounded-md bg-slate-400 text-white" 
                                         onMouseDown={(e) => handleGetComponent(e,'Gauge')}
                                    >
                                        Gauge
                                    </button>
                                </li>
                                <li >
                                    <button className="flex justify-center items-center w-full h-10 rounded-md bg-slate-400 text-white" 
                                         onMouseDown={(e) => handleGetComponent(e,'Temperature')}
                                    >
                                        Temperature
                                    </button>
                                </li>
                            </ul>
                            :null}
                        </div>
                        <button className="button flex justify-center items-center w-2/12 h-full absolute right-0 bg-slate-600 opacity-50 hover:opacity-70" onClick={HideSideBar}>
                            <img src={ReturnImg} alt="Return" className="button-img w-3/5"/>
                        </button>
                    </div>
                    <div id="panel" className="w-full z-10 relative">
                        {components.map((component) => renderComponent(component))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
