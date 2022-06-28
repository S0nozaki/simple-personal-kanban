import React from 'react'
import { Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from "react";

const Column = ({ column, onEditColumn, onDelete, onCreateTask, onDeleteTask }) => {
    const [taskName, setTaskName] = useState("")
    const [isEditingColumn, setIsEditingColumn] = useState(false)
    const [editColumnName, setEditColumnName] = useState("")
    const handleKeyDown = (event) => {
        if(event.keyCode===13){
            handleSubmit(event)
        }
        if(event.key === "Escape"){
            setEditColumnName('')
            setIsEditingColumn(false)
        }
    }
    const handleSubmit = (event) => {
        if (!event.target.id.includes("edit")){
            if(taskName!==""){
                onCreateTask(column.id,taskName)
                setTaskName('')
            }
        } else if (event.target.id.includes("column")) {
            if(editColumnName !== ""){
                onEditColumn(event.target.id, editColumnName)
                setEditColumnName('')
                setIsEditingColumn(false)
            }
        }
    }
    return (
        <div className="column">
            <div className="column-header">
            <div className="column-title">
                <h3 className={isEditingColumn ? "invisible" : ""} onClick={()=>setIsEditingColumn(true)}>{column.name}</h3>
                <input type="text" id={"input-edit-column-"+column.id} className={isEditingColumn ? "" : "invisible"} value={editColumnName}
                placeholder={column.name} onClick={()=> setEditColumnName(column.name) } onChange={event=>setEditColumnName(event.target.value)} onKeyDown={handleKeyDown}></input>
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
