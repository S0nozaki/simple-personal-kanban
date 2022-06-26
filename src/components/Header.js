import { useRef } from 'react'
import { useState } from "react";
import LoginForm from './LoginForm';
import { writeUserKanban } from '../firebase';

const Header = ({ onAdd, columns, onImportFile, onSignOut, user }) => {
    const [showLogin, setShowLogin] = useState(false)
    const login = () => {
        setShowLogin(!showLogin)
    }
    const logout = () => {
        onSignOut()
    }
    const [columnName, setColumnName] = useState("")
    const handleKeyDown = (event) => {
        if(event.keyCode===13){
            addColumn(columnName)
        }
    }
    const inputFile = useRef(null)
    const addColumn = () => {
        if(columnName!==""){
            onAdd(columnName)
            setColumnName("")
        }
    }
    const onImport = () => {
        inputFile.current.click()
    }
    const onFileUpload = (event) => {
        let file = event.target.files[0]
        let fileReader = new FileReader()
        fileReader.onloadend = (e) => {
            onImportFile(JSON.parse(e.target.result))
        }
        fileReader.readAsText(file)
    }
    const onSave = () => {
        writeUserKanban(user, columns)
    }
    return (
        <header className="header">
            <LoginForm isVisible={showLogin} hideLogin={setShowLogin}></LoginForm>
            <h1>Personal Kanban</h1>
            <input type="text" id={"column-input"} placeholder="New column name"
            onChange={event=>setColumnName(event.target.value)} value={columnName} onKeyDown={handleKeyDown}></input>
            <button onClick={addColumn}>Add column</button>
            <a href={'data:text/json;charset=utf-8,'+JSON.stringify(columns)}
            download="boardExportFile.json" target="_blank" rel="noreferrer"
            ><button>Export to JSON file</button></a>
            <input type="file" name="Import JSON file" hidden ref={inputFile} onChange={onFileUpload}></input>
            <button onClick={onImport}>Import</button>
            <button onClick={onSave} className={user == null ? "invisible" : ""}>Save</button>
            <button onClick={login} className={user == null ? "" : "invisible"}>Log in</button>
            <button onClick={logout} className={user == null ? "invisible" : ""}>Log out</button>
        </header>
    )
}

export default Header
