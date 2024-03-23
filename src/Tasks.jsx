
import Modal from 'react-modal';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { FaEdit } from "react-icons/fa";

import 'react-notifications/lib/notifications.css';
const baseURL = 'http://localhost:3001';
const {useState, useEffect} = require('react');

function Tasks (){
    const [taskList, setTaskList]  = useState([]);
    const [openPopup, setOpenPopup] = useState(false);
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('');
    const [description, setDescription] = useState('');
    let subtitle;
    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      };
      function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#E3F0ED';
      }
    const getTaskList  = async () =>{
        const response = await fetch(baseURL + '/task/list',
          {
            method: 'GET'
          }
        )
        if(response.ok){
           const dataResponse  = await response.json();
           console.log('dataResponse is', dataResponse)
           if(!dataResponse.error)
              setTaskList(dataResponse.data)
        }
    }
    const addTask = async (e) =>{
        e.preventDefault();
        const body = {
          "title": title,
          "description": description,
          "status": status
        }
        const response = await fetch(baseURL + '/task/add',
        {
          method: 'POST',
          body: JSON.stringify(body),
          headers : {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
        }
      )
      if(response.ok){
         const dataResponse  = await response.json();
         console.log('dataResponse is', dataResponse)
         if(!dataResponse.error){
            NotificationManager.success(dataResponse.msg, '', 5000);
            getTaskList();
            setOpenPopup(false);
         }
           
      }
    }
    const editTask = (data) =>{
        console.log('data is ', data);
        setTitle(data.title);
        setDescription(data.description);
        setStatus(data.status);
        setOpenPopup(true);
        return;
    }
    console.log('taskList is ', taskList);
    useEffect( ()=>{
        console.log('called');
         getTaskList()
    }, [])
    const rows = taskList.map((element, index) => (
        <div className='rowWrapper'>
            <div className='title-wrapper'>
            <h1>{element.title}</h1>
            {element.status == 'TODO' ?  <div className='TODO'>{element.status}</div>: element.status == 'INPROGRESS' ? <div className='InProgress'>{element.status}</div>: <div className='Done'>{element.status}</div>}
            <FaEdit onClick={ () => editTask(element)} className='edit-button'/>

            </div>
           
            <p className='description'>{element.description}</p>
        </div>
    ))

    return  <>
    <h1> coming from task {taskList.length}</h1>
    <button className='addTask' onClick={setOpenPopup}> Add Task</button>
    <div className='listWrapper'>
    
   
    {rows} 
    </div>
    <Modal
        isOpen={openPopup}
        onAfterOpen={afterOpenModal}
        onRequestClose={ () => setOpenPopup(false)}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Add Task</h2>
        <button onClick={ ()=> setOpenPopup(false)}>close</button>
        <div>I am a modal</div>
        <form className='popup-body' type="post" onClick={ () => {return false}}>
            <div className='popup-row'>
          <input type="text" name="title" value={title} onChange={(e) =>setTitle(e.target.value)}/>
          </div>
          <div className='popup-row'>
          <label for="title">Choose a Status:</label>
          <select name="title" id="title" onChange={(e) =>setStatus(e.target.value)}>
          <option value="TODO" selected={status== 'TODO'?true: false}>To Do</option>
  <option value="INPROGRESS" selected={status== 'INPROGRESS'?true: false}>In Progress</option>
  <option value="DONE" selected={status== 'DONE'?true: false}>Done</option>

          </select>
          </div>
          <div className='popup-row'>
          <input type="text" name="description" value={description} onChange={(e) =>setDescription(e.target.value)}/>
          </div>
          <button onClick={ (e) => addTask(e)} type='submit'> Add</button>
        </form>
      </Modal>
      <NotificationContainer/>
    </>

}
export default Tasks;