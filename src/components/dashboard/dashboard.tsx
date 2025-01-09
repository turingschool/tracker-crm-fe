import {useUserLoggedContext} from "../../context/UserLoggedContext";
import { fetchDashBoardData } from '../../apiCalls';
import React, {useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import {DashBoardDattaI} from "../../Interfaces";

export const DashBoard : React.FC = () => {
    const [dashData, setDashData] = useState<DashBoardDattaI>(
        {
        job_applications: [null],
        contacts: [null],
        companies: [null]
    });
    const {isLoggedIn, userData,token } = useUserLoggedContext()


    console.log("token",token)
    useEffect(()=>{

        const dashDataFetcher = async () => {
            try {
                const allData = await fetchDashBoardData(userData.user.data.id, token)
                return await setDashData(allData)

            } catch (error) {
                // return error
            }
        };
        dashDataFetcher()

    },[])


    console.log("MData",dashData)

    if(token && isLoggedIn){
        return (
            <>
                <div>
                    <h1>Welcome, {userData.user.data.attributes.name}</h1>
                </div>
                <div className="inline-block">

                    <div className="bg-pink-500">
                        <label>Jobs</label>
                        <label>{`${dashData.job_applications.length }`}</label>
                        <label>Apps submitted this week</label>
                    </div>

                    <div className="bg-blue-700">
                        <label>Contacts</label>
                        <label>{`${dashData.contacts.length}`}</label>
                        <label>New connections this week</label>
                    </div>

                    <div className='bg-green-500'>
                        <label>Companies</label>
                        <label>{`${dashData.companies.length}`}</label>
                        <Link to="/companies/new">Add new company</Link>

                    </div>
                </div>


            </>
        )
    } else {
        return (
            <>
                <label>Get Out</label>
            </>
        )
    }

}

export default DashBoard;