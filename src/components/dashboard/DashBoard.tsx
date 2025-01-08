import {useUserLoggedContext} from "../../context/UserLoggedContext";
import { fetchDashBoardData } from '../../apiCalls';
import React from 'react'
export const DashBoard : React.FC = () => {

    const {isLoggedIn, userData,token } = useUserLoggedContext()
    if(token && isLoggedIn){
        return (
            <>
                <div>
                    <h1>Welcome, {userData.user.data.attributes.name}</h1>
                </div>

                <div className="bg-pink-500">
                    <label>Jobs</label>
                    <label>{dashBoardData.data.id}</label>
                    <label></label>
                </div>

                <div className="bg-blue-700">
                    <label>Contacts</label>
                    <label></label>
                    <label></label>
                </div>

                <div className='bg-green-500'>
                    <label>Companies</label>
                    <label></label>
                    <label></label>
                </div>


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