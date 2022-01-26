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
            <form>
                <h1>{login ? "Log in" : "Sign up"}</h1>
                <label>Username </label>
                <input type="text" name="username" className="login-form" onChange={event=>setUsername(event.target.value)} value={username}/>
                <br></br>
                <label>Password </label>
                <input type="password" name="password" className="login-form" onChange={event=>setPassword(event.target.value)} value={password}/>
                <br></br>
                <input type="button" value="Log in" className={login ? "" : "invisible"} onClick={handleLogIn}/>
                <input type="button" value="Sign up" className={login ? "invisible" : ""} onClick={handleSignUp}/>
                <br></br>
                <label>{login ? "Don't": "Already"} have an account? </label>
                <a href="#" onClick={()=>setLogin(!login)}>{login ? "Sign up": "Log in"}</a>
            </form>
        </div>
    );
}

export default LoginForm;