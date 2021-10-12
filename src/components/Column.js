import React from 'react'
import { Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from "react";

const Column = ({ column, onDelete, onCreateTask, onDeleteTask }) => {
    const [taskName, setTaskName] = useState("")
    const handleKeyDown = (event) => {
        if(event.keyCode===13){
            handleSubmit()
        }
    }
    const handleSubmit = (event) => {
        if(taskName!==""){
            onCreateTask(column.id,taskName)
            setTaskName('')
        }
    }
    return (
        <div className="column">
            <div className="column-header">
            <div className="column-title">
                <h3>{column.name}</h3>
                <button onClick={()=>onDelete(column.id)}>X</button>
            </div>
            <div className="column-input-bar">
            <input type="text" id={"input-"+column.id} placeholder="New task name"
            onChange={event=>setTaskName(event.target.value)} value={taskName} onKeyDown={handleKeyDown}></input>
            <button type="submit" onClick={handleSubmit}>+</button>
            </div>
            </div>
            <Droppable droppableId={column.id}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    style={{ backgroundColor: snapshot.isDraggingOver ? 'hsl(200, 100%, 70%)' : 'hsl(199, 81%, 90%)'}}
                    {...provided.droppableProps}
                >
                <div className={"tasks " + (column.tasks.length === 0 ? "empty-tasks" : "full-tasks")}>
                {column.tasks.map((task, index)=>(
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                            >
                                <div className="task">
                                <div className="task-header" onClick={()=>alert("asd")}>
                                {task.name}
                                <button onClick={()=>onDeleteTask(column.id, task.id)}>X</button>
                                </div>
                                </div>
                            </div>
                        )}
                    </Draggable>
                ))}
                {provided.placeholder}
                </div>
                </div>
            )}
            </Droppable>
        </div>
    )
}

export default Column
