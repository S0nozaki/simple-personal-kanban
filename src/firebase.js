import React from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Firebase = ({ onSetUser }) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    onAuthStateChanged(auth, user =>{
        if(user!==null){
            console.log("logged in!")
            console.log(user.uid)
            onSetUser(user)
        }
        else {
            console.log("No user :(")
            onSetUser(null)
        }
    })
    return <></>
}

const logInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
}

const setNewUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
}

const signOutAllUsers = () => {
    signOut(auth)
}
export const logIn = logInUser
export const createUser = setNewUser
export const signOutUser = signOutAllUsers
export default Firebase;