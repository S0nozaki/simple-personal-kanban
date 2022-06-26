import Columns from "./components/Columns";
import Header from "./components/Header";
import { useState } from "react";
import { DragDropContext} from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import Firebase, { signOutUser, getUserKanban } from "./firebase"

function App() {
  const [columns, setColumns] = useState([{id:uuidv4(), name:'columna',tasks:[{id:uuidv4(), name:"Generar columnas"},{id:uuidv4(), name:"Generar columna"},{id:uuidv4(), name:"Generar tasks"}]}])//,{id:1, name:'columna2',tasks:[]}
  const addColumn = (columnName) => {
    setColumns([...columns, {id:uuidv4(), name:columnName, tasks:[]}])
  }
  const deleteColumn = (id) =>{
    setColumns(columns.filter(column => column.id !== id))
  }
  const importFile = (importedColumns) => {
    setColumns([...importedColumns])
  }
  const createTask = (id, name) => {
    setColumns(columns.map(column => column.id === id ? {id:column.id, name:column.name, tasks:[...column.tasks, {id:uuidv4(), name:name}]} : column))
  }
  const deleteTask = (columnID, deleteID) => {
    setColumns(columns.map(column => column.id === columnID ? {id:column.id, name:column.name, tasks:[...column.tasks.filter((task)=>task.id!==deleteID)]} : column))
  }
  const dragEnd = (res) => {
    const { source, destination } = res;
    if(!destination || ((source.droppableId === destination.droppableId) && (source.index === destination.index))) return
    var sourceColumn = columns.filter(column => column.id === source.droppableId)[0]
    const [deleted] = sourceColumn.tasks.splice(source.index, 1);
    if(source.droppableId === destination.droppableId){
      sourceColumn.tasks.splice(destination.index,0,deleted);
    } else {
      var newColumn = columns.filter(column => column.id === destination.droppableId)[0]
      newColumn.tasks.splice(destination.index,0,deleted);
      setColumns(columns.map(column => column.name === destination.droppableId ? newColumn : column))
    }
    setColumns(columns.map(column => column.name === source.droppableId ? sourceColumn : column))
  }
  const [user, setUser] = useState()
  const setUserData = async (user_id) => {
    setUser(user_id)
    importFile(await getUserKanban(user_id))
  }
  return (
    <>
      <Firebase onSetUserData={setUserData}></Firebase>
      <Header onAdd={addColumn} columns={columns} onImportFile={importFile} onSignOut={signOutUser} user={user}></Header>
      <DragDropContext onDragEnd={result => dragEnd(result)}>
        <div className="container">
          <Columns columns={columns} onDelete={deleteColumn} onCreateTask={createTask} onDeleteTask={deleteTask}></Columns>
        </div>
      </DragDropContext>
    </>
  );
}

export default App;
