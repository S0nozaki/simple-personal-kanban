import { useState } from "react"

const TaskCard = ( { isTaskCardVisible, setIsTaskCardVisible, selectedTask, setSelectedTask, onEditTask }) => {
    const [editedTaskName, setEditedTaskName] = useState('')
    const [comment, setComment] = useState('')
    const handleClose = (event) => {
        setIsTaskCardVisible(false)
        setSelectedTask({})
        setEditedTaskName('')
        setComment('')
    }
    const handleClick = (type) => {
        if(type ==="Title"){
            if(!editedTaskName)
                setEditedTaskName(selectedTask.name)
        } else {
            if(!comment && selectedTask.comment)
                setComment(selectedTask.comment)
        }
    }
    const handleSubmit = (event) => {
        let modifiedTask = {...selectedTask}
        let hasModification = false
        if(editedTaskName && editedTaskName!==selectedTask.name){
            modifiedTask = {...modifiedTask, id: selectedTask.id, name: editedTaskName }
            hasModification = true
        }
        if((!selectedTask.comment && comment!=="") || (selectedTask.comment && selectedTask.comment !== comment)){
            modifiedTask = {...modifiedTask, id: selectedTask.id, comment: comment}
            hasModification = true
        }
        if(hasModification)
            onEditTask(selectedTask.columnID, {...modifiedTask})
        handleClose(event);
    }
    return (
        <div className={isTaskCardVisible? "visible-card task-card-container" : "invisible"}>
            <div className="task-card">
                <div className="card-header">
                    <label>Task title</label>
                    <input placeholder={selectedTask.name} value={editedTaskName} onClick={()=>{handleClick("Title")}} onChange={event=>setEditedTaskName(event.target.value)}></input>
                    <button onClick={handleClose}>X</button>
                </div>
                <div className="card-body">
                    <label>Additional comments</label>
                    <textarea className="card-textarea" placeholder={selectedTask.comment} value={comment} onClick={()=>{handleClick("Comment")}} onChange={event=>setComment(event.target.value)}></textarea>
                </div>
                <div className="card-footer">
                    <button onClick={handleSubmit}>Save</button>
                </div>
            </div>
        </div>
    )
}

export default TaskCard