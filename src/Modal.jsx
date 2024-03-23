import Modal from 'react-modal';
import { IoMdClose } from "react-icons/io";
const TaskModal = ({title, status, description, openPopup, setOpenPopup, subtitle, popupType, setTitle, setStatus, setDescription, addTask}) => {
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
    return  <>
    
    <Modal
        isOpen={openPopup}
        onRequestClose={() => setOpenPopup(false)}
        style={customStyles}

    >
        <h2 >{subtitle + (popupType !== 'Add' ? title : '')}</h2>
        <IoMdClose onClick={() => { setOpenPopup(false) }} className='popup-close' />

        <form className='popup-body' type="post" onClick={() => { return false }}>

            {popupType == 'Add' && <div className='popup-row'>
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
    </>
}

export default TaskModal