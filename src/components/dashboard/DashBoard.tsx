import React, { MouseEventHandler } from "react";
// import {userData} from '../../App.tsx'


export const DashBoard =({userData} : {userData:(id: number , userToken: string, name:string)=>void},handleLogout:Function):React.JSX.Element=>{

    return (
        <>
            <label className="bg-pink-500">Hello world</label>
                <h1>Welcome, {userData.name}</h1>
                <button onClick={handleLogout}>Log Out</button>
        </>
    )
}

export default DashBoard;