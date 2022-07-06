import React, { useState } from "react";

const LoginForm = ({ isVisible, hideLogin, onCreateUser, onLogIn }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [login, setLogin] = useState(true)
    const handleLogIn = async () => {
        onLogIn(username, password)
        handleSubmit()
    }
    const handleSignUp = async () => {
        onCreateUser(username, password)
        handleSubmit()
    }
    const handleKeyDown = (event, login) => {
        if(event.keyCode===13){
            if(login)
                handleLogIn()
            else
                handleSignUp()
        }
    }
    const handleSubmit = () => {
        setUsername("")
        setPassword("")
        hideLogin(false)
    }
    return (
        <div className={isVisible? "visible-modal login-container" : "invisible"}>
            <form className="login-form" onKeyDown={event=>handleKeyDown(event,login)}>
                <div className="login-header">
                    <h1>{login ? "Log in" : "Sign up"}</h1>
                </div>
                <div className="login-body">
                    <label className="login-body-label">Username </label>
                    <input type="text" name="username" className="login-input" onChange={event=>setUsername(event.target.value)} value={username}/>
                    <label className="login-body-label">Password </label>
                    <input type="password" name="password" className="login-input" onChange={event=>setPassword(event.target.value)} value={password}/>
                    <input type="button" value="Log in" className={login ? "" : "invisible"} onClick={handleLogIn}/>
                    <input type="button" value="Sign up" className={login ? "invisible" : ""} onClick={handleSignUp}/>
                </div>
                <div className="login-footer">
                    <label>{login ? "Don't": "Already"} have an account?
                    <a href="#" onClick={()=>setLogin(!login)}>{login ? "Sign up": "Log in"}</a></label>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;