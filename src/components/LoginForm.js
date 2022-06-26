import React, { useState } from "react";
import { createUser, logIn } from "../firebase"

const LoginForm = ({ isVisible, hideLogin }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [login, setLogin] = useState(true)
    const handleLogIn = async () => {
        try {
            await logIn(username, password)
        } catch {
            alert("User couldn't log in")
        }
        handleSubmit()
    }
    const handleSignUp = async () => {
        try {
            await createUser(username, password)
        } catch {
            alert("User couldn't be created")
        }
        handleSubmit()
    }
    const handleSubmit = () => {
        setUsername("")
        setPassword("")
        hideLogin(false)
    }
    return (
        <div className={isVisible? "visible" : "invisible"}>
            <form className="login-form">
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