import Columns from "./components/Columns";
import Header from "./components/Header";
import TaskCard from "./components/TaskCard";
import { useState, useEffect } from "react";
import { DragDropContext} from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import { initializeFirebaseApp, initializeAuth, initializeDB, createNewUser, logIn, signOutAll, writeUserKanban, getUserKanban } from "./firebase"
import { onAuthStateChanged } from "firebase/auth"

function App() {
  const [app, setApp] = useState(initializeFirebaseApp())
  const [auth, setAuth] = useState(initializeAuth(app))
  const [db, setDB] = useState(initializeDB(app))
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [columns, setColumns] = useState([{id:uuidv4(), name:'columna',tasks:[{id:uuidv4(), name:"Generar columnas"},{id:uuidv4(), name:"Generar columna"},{id:uuidv4(), name:"Generar tasks"}]}])//,{id:1, name:'columna2',tasks:[]}
  const addColumn = (columnName) => {
    setColumns([...columns, {id:uuidv4(), name:columnName, tasks:[]}])
    setUnsavedChanges(true)
  }
  const deleteColumn = (id) =>{
    setColumns(columns.filter(column => column.id !== id))
    setUnsavedChanges(true)
  }
  const editColumn = (id, newName) => {
    setColumns(columns.map(column => id.includes(column.id) ? {...column, name:newName} : column ))
    setUnsavedChanges(true)
  }
  const importFile = (importedColumns) => {
    setColumns([...importedColumns])
  }
  const createTask = (id, name) => {
    setColumns(columns.map(column => column.id === id ? {id:column.id, name:column.name, tasks:[...column.tasks, {id:uuidv4(), name:name}]} : column))
    setUnsavedChanges(true)
  }
  const deleteTask = (columnID, deleteID) => {
    setColumns(columns.map(column => column.id === columnID ? {id:column.id, name:column.name, tasks:[...column.tasks.filter((task)=>task.id!==deleteID)]} : column))
    setUnsavedChanges(true)
  }
  const [selectedTask, setSelectedTask] = useState({})
  const selectTask = (columnID, selectID) => {
    setSelectedTask({...(columns.find(column => column.id === columnID).tasks.find(task => task.id === selectID)), columnID: columnID})
    setIsTaskCardVisible(true)
  }
  const editTask = (columnID, editedTask) => {
    setColumns(columns.map(column => column.id === columnID ? {id:column.id, name:column.name, tasks:column.tasks.map(task => task.id === editedTask.id ? editedTask : task)} : column))
    setUnsavedChanges(true)
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
    setUnsavedChanges(true)
  }
  const [user, setUser] = useState()
  const setUserData = async (user_id) => {
    setUser(user_id)
    importFile(await getUserKanban(db, user_id))
  }
  const [isTaskCardVisible, setIsTaskCardVisible] = useState(false)

  const createUser = async (email, password) => { createNewUser(auth, email, password) }
  const logInUser = async (email, password) => { logIn(auth, email, password) }
  const signOutUser =() => {
    signOutAll(auth)
  }
  const saveKanban = () => {
    writeUserKanban(db, user, columns)
  }

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, user =>{
        if(user!==null)
          setUserData(user.uid)
        else
          setUserData(null)
      })
    return () => { unsubscribe() }
  }, [])
  return (
    <>
      <Header onAdd={addColumn} columns={columns} onImportFile={importFile} onCreateUser={createUser} onLogIn={logInUser} onSignOut={signOutUser} onSaveKanban={saveKanban} user={user} unsavedChanges={unsavedChanges} setUnsavedChanges={setUnsavedChanges}></Header>
      <TaskCard isTaskCardVisible={isTaskCardVisible} setIsTaskCardVisible={setIsTaskCardVisible} selectedTask={selectedTask} setSelectedTask={setSelectedTask} onEditTask={editTask}></TaskCard>
      <DragDropContext onDragEnd={result => dragEnd(result)}>
        <div className="container">
          <Columns columns={columns} onEditColumn={editColumn} onDelete={deleteColumn} onCreateTask={createTask} onDeleteTask={deleteTask} onSelectTask={selectTask}></Columns>
        </div>
      </DragDropContext>
    </>
  );
}

export default App;
