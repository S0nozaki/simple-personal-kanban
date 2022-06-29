import React, {useEffect} from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword} from "firebase/auth";
import { getFirestore, collection, getDocs, query, where, orderBy, addDoc, writeBatch } from 'firebase/firestore'
import { v4 as uuidv4 } from "uuid";

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
const db = getFirestore(app)

export const getUserKanban = async (user_id) => {
    let tasksRef = collection(db, "tasks")
    return getDocs(query(tasksRef, where("user_id", "==", user_id), orderBy("column_order"), orderBy("order"))).then((tasks) => {
        let columns = {}
        tasks.forEach((task)=>{
            let column_name = task.data().column_name
            if(columns === {} || !(column_name in columns)){
                if(task.data().name)
                    if(task.data().comment)
                        columns[column_name] = [{"id": uuidv4(), "name": task.data().name, "comment": task.data().comment}]
                    else
                        columns[column_name] = [{"id": uuidv4(), "name": task.data().name}]
                else
                    columns[column_name] = []
            } else if(column_name in columns){
                if(task.data().comment)
                    columns[column_name].push({"id": uuidv4(), "name": task.data().name, "comment": task.data().comment})
                else
                    columns[column_name].push({"id": uuidv4(), "name": task.data().name})
            }
        })
        let userKanban = Object.keys(columns).map((key) => ({"id":uuidv4() ,"name":key, "tasks":columns[key]}))
        return userKanban
    })
}

const deleteUserKanban = async (user_id) => {
    let tasksRef = collection(db, "tasks")
    let batch = writeBatch(db)
    return getDocs(query(tasksRef, where("user_id", "==", user_id))).then((tasks) => {
        tasks.forEach(task => {
            batch.delete(task.ref)
        })
        return batch.commit()
    })
}

export const writeUserKanban = async (user_id, kanban) => {
    let tasksRef = collection(db, "tasks")
    await deleteUserKanban(user_id)
    let writeList = []
    let column_order = 0
    kanban.forEach((column) => {
        column_order++
        let task_order = 0
        if(column.tasks.length === 0) {
            writeList.push(addDoc(tasksRef, {
                column_name: column.name,
                column_order: column_order,
                order: task_order,
                user_id: user_id
            }))
        } else {
            column.tasks.forEach((task)=>{
                task_order++
                if(task.comment){
                    writeList.push(addDoc(tasksRef, {
                    column_name: column.name,
                    column_order: column_order,
                    name: task.name,
                    order: task_order,
                    comment: task.comment,
                    user_id: user_id
                    }))
                } else {
                    writeList.push(addDoc(tasksRef, {
                    column_name: column.name,
                    column_order: column_order,
                    name: task.name,
                    order: task_order,
                    user_id: user_id
                    }))
                }
            })
        }
    })
    return await Promise.all(writeList)
}

const Firebase = ({ onSetUserData }) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user =>{
            if(user!==null){
                console.log("logged in!")
                console.log(user.uid)
                onSetUserData(user.uid)
            }
            else {
                console.log("No user :(")
                onSetUserData(null)
            }
        })
        return () => { unsubscribe() }
    }, [])
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