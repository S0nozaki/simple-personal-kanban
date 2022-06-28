import { useState } from "react"

const TaskCard = ( { isTaskCardVisible, setIsTaskCardVisible, selectedTask, setSelectedTask, onEditTask }) => {
    const [editedTaskName, setEditedTaskName] = useState('')
    const handleClose = (event) => {
        setIsTaskCardVisible(false)
        setSelectedTask({})
        setEditedTaskName('')
    }
    const editTaskName = (newName) => {
        if(newName!==""){
            setEditedTaskName(newName)
        }
    }
    const handleSubmit = (event) => {
        if(editedTaskName!==selectedTask.name){
            onEditTask(selectedTask.columnID, {id: selectedTask.id, name: editedTaskName})
            handleClose(event);
        }
    }
    return (
        <div className={isTaskCardVisible? "visible-card task-card-container" : "invisible"}>
            <div className="task-card">
                <div className="card-header">
                    <label>Task title</label>
                    <input placeholder={selectedTask.name} value={editedTaskName} onClick={()=>{setEditedTaskName(selectedTask.name)}} onChange={event=>editTaskName(event.target.value)}></input>
                    <button onClick={handleClose}>X</button>
                </div>
                <div className="card-body">
                    <label>Additional comments</label>
                    <textarea className="card-textarea"></textarea>
                </div>
                <div className="card-footer">
                    <button onClick={handleSubmit}>Save</button>
                </div>
            </div>
        </div>
    )
}

export default TaskCard