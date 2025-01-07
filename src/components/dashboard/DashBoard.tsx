import {useUserLoggedContext} from "../../context/UserLoggedContext";
import React from 'react'
export const DashBoard : React.FC = () => {
    const {isLoggedIn, clearUserLogged, userData,token } = useUserLoggedContext()
    if(token && isLoggedIn){
        return (
            <>
                <label className="bg-pink-500">Hello world</label>
                <h1>Welcome, {userData.user.data.attributes.name}</h1>
                <button onClick={()=>clearUserLogged}>Log Out</button>
            </>
        )
    } else {
        return (
            <>
                <label>Wow Your good</label>
            </>
        )
    }

}

export default DashBoard;