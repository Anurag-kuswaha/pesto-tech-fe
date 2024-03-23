
import Modal from 'react-modal';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoMdClose } from "react-icons/io";


import 'react-notifications/lib/notifications.css';
const baseURL = 'http://localhost:3001';
const { useState, useEffect } = require('react');

function Tasks() {
    const [taskList, setTaskList] = useState([]);
    const [openPopup, setOpenPopup] = useState(false);
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('');
    const [description, setDescription] = useState('');
    const [subtitle, setSubtitle] = useState('Add Task');
    const [popupType, setPopupType] = useState('Add');
    const [actualTaskList, setActualTaskList] = useState([]);
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '30vw',
            minHeight: '60vh',
            maxWidth: '80%'
        
        },
    };
    const getTaskList = async () => {
        const response = await fetch(baseURL + '/task/list',
            {
                method: 'GET'
            }
        )
        if (response.ok) {
            const dataResponse = await response.json();
            console.log('dataResponse is', dataResponse)
            if (!dataResponse.error){
                setTaskList(dataResponse.data);
                setActualTaskList(dataResponse.data);
            }
        }
    }
   const doStatusFilter = async (status) =>{
    console.log('selected filter is ', status);
    if(status == 'ALL') return  setTaskList(actualTaskList);
    const filteredTaskList  = actualTaskList.filter( (val, index) =>{
        return val.status === status ;
    })
    setTaskList(filteredTaskList);
    
   }
    const addTask = async (e) => {
        e.preventDefault();
        const body = {
            "title": title,
            "description": description,
            "status": status
        }
        let relativePath = '/task/add'
        if(popupType !== 'Add')  relativePath = `/task/update/${encodeURIComponent(title)}`
        const response = await fetch(baseURL + relativePath,
            {
                method: popupType == 'Add'? 'POST' : 'PATCH',
                body: JSON.stringify(body),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        )
        if (response.ok) {
            const dataResponse = await response.json();
            console.log('dataResponse is', dataResponse)
            if (!dataResponse.error) {
                NotificationManager.success(dataResponse.msg, '', 5000);
                getTaskList();
                setOpenPopup(false);
            } else {
                console.log('error is ',dataResponse )
                NotificationManager.error(dataResponse.msg, '', 5000);
            } 

        } else{
            const dataResponse = await response.json();
            NotificationManager.error(dataResponse.msg, '', 5000);
        }
    }
    const editTask = (data) => {
        console.log('data is ', data);
        setTitle(data.title);
        setDescription(data.description);
        setStatus(data.status);
        setOpenPopup(true);
        setSubtitle('Edit ');
        setPopupType('Edit')
        return;
    }

    const deleteTask = async (id) => {

        const response = await fetch(baseURL + `/task/delete/${id}`,
            {
                method: 'DELETE',
                body: JSON.stringify({}),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        )

        if (response.ok) {
            const dataResponse = await response.json();
            console.log('dataResponse is', dataResponse)
            if (!dataResponse.error) {
                NotificationManager.success(dataResponse.msg, '', 5000);
                getTaskList();
            }

        }
    }
    console.log('taskList is ', taskList);
    useEffect(() => {
        console.log('called');
        getTaskList()
    }, [])
    const rows = taskList.map((element, index) => (
        <div className='rowWrapper'>
            <div className='title-wrapper'>
                <h1>{element.title}</h1>
                {element.status == 'TODO' ? <div className='TODO'>{element.status}</div> : element.status == 'INPROGRESS' ? <div className='InProgress'>{element.status}</div> : <div className='Done'>{element.status}</div>}
                <FaEdit onClick={() => editTask(element)} className='edit-button' />

            </div>
            <div className='description-wrapper'>
                <p className='description'>{element.description}</p>
                <MdDelete onClick={() => deleteTask(element.title)} className='delete-button' />
            </div>
        </div>
    ))

    return <>
        <h1> Pesto Tech : Full-Stack Developer Challenge</h1>
        <button className='addTask' onClick={() => { setStatus('TODO');setSubtitle('Add Task'); setPopupType('Add'); setOpenPopup(true) }}> Add Task</button>

        <div className='filter'>
                    <label for="status-filter">Filter:</label>
                    <select name="status-filter" id="status-filter" onChange={(e) => doStatusFilter(e.target.value)}>
                    <option value="ALL" > All</option>
                        <option value="TODO" >To Do</option>
                        <option value="INPROGRESS" >In Progress</option>
                        <option value="DONE" >Done</option>

                    </select>
                </div>
                <h1> Total Tasks : {taskList.length}</h1>
        <div className='listWrapper'>


            {rows}
        </div>
        <Modal
            isOpen={openPopup}
            onRequestClose={() => setOpenPopup(false)}
            style={customStyles}
            // className='modal-wrapper'
         
        >
            <h2 >{subtitle + (popupType !=='Add' ? title: '')}</h2>
            <IoMdClose onClick={() => { setOpenPopup(false) }} className='popup-close'/>

            <form className='popup-body' type="post" onClick={() => { return false }}>
                
            {popupType=='Add' && <div className='popup-row'>
                    <label name="title">Title </label>
                    <input type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
         }     
                <div className='popup-row status'>
                    <label for="title">Choose a Status:</label>
                    <select name="title" id="title" onChange={(e) => setStatus(e.target.value)}>
                        <option value="TODO" selected={status == 'TODO' ? true : false}>To Do</option>
                        <option value="INPROGRESS" selected={status == 'INPROGRESS' ? true : false}>In Progress</option>
                        <option value="DONE" selected={status == 'DONE' ? true : false}>Done</option>

                    </select>
                </div>
                <div className='popup-row'>
                <label name="title"> Description </label>
                    <input type="text" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <button onClick={(e) => addTask(e)} type='submit'> {popupType} </button>
            </form>
        </Modal>
        <NotificationContainer />
    </>

}
export default Tasks;