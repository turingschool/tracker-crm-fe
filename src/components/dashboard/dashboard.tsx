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

    if(token && isLoggedIn){
        return (
            <>
                <div className="fixed top-[15vh] left-[25vh] right-0 font-bold font-size-[4vh] text-5xl text-cyan-600">
                    <h1>Welcome, {userData.user.data.attributes.name}</h1>
                </div>
                <div className="ml-2 fixed top-[20vh] left-[25vh]">

                    <div className="bg-white w-[20vw] h-[17vh] inline-block rounded-[20px] shadow-black shadow-xl">
                        <label className='text-center block text-[20px] font-bold text-cyan-600 mt-1'>Jobs</label>
                        <label className='text-center block mt-1 font-bold text-[50px] text-cyan-600' data-cy="dashJobNum">{`${dashData.job_applications.length }`}</label>
                        <label className='text-center block text-[20px] font-bold text-cyan-600 mt-1'>Apps submitted this week</label>
                    </div>

                    <div className="bg-white w-[20vw] h-[17vh] inline-block m-24 rounded-[20px] shadow-black shadow-xl">
                        <label className='text-center block text-[20px] font-bold text-cyan-600 mt-2'>Contacts</label>
                        <label className='text-center block mt-1 font-bold text-[50px] text-cyan-600' data-cy="dashConNum">{`${dashData.contacts.length}`}</label>
                        <label className='text-center block text-[20px] font-bold text-cyan-600 mt-1' data-cy="conLabel">New connections this week</label>
                    </div>

                    <div className='bg-white w-[20vw] h-[17vh] inline-block rounded-[20px] shadow-black shadow-xl'>
                        <label className='text-center block text-[20px] font-bold text-cyan-600 mt-2'>Companies</label>
                        <label className='text-center block mt-1 font-bold text-[50px] text-cyan-600' data-cy="dashCompNum">{`${dashData.companies.length}`}</label>
                        <Link className='text-center block text-[20px] font-bold bg-cyan-600 mt-1 w-[16vw] text-white ml-[3vh]' to="/companies/new">Add new company</Link>

                    </div>
                </div>


            </>
        )
    } else {
        return (
            <>
                <label className="fixed top-[15vh] left-[25vh] right-0 font-bold font-size-[4vh] text-5xl text-cyan-600">Pleas try again later</label>
            </>
        )
    }

}

export default DashBoard;