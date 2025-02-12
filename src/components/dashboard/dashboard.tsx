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
    const jobApplicationsCount: number = dashData.job_applications.length
    const contactsCount: number = dashData.contacts.length
    const companiesCount: number = dashData.companies.length

    interface CountProps {
        section: string;
        sectionCount: number;
        sectionUrl: string;
    }

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

    const ConditionallyRenderBtn: React.FC<CountProps> = ({ section, sectionCount, sectionUrl}) => {
    if (sectionCount >= 1) {
        return <><label className='text-center block mt-1 font-bold text-[50px] text-cyan-600' data-cy="dashJobNum">{`${sectionCount}`}</label>
        <label className='text-center block text-[20px] font-bold text-cyan-600 mt-1'>Apps submitted this week</label></>
    }
    return <><label className='text-center block mt-1 font-bold text-[50px] text-cyan-600' data-cy="dashJobNum">{`${sectionCount}`}</label>
        <Link className='text-center block text-[20px] font-bold bg-cyan-600 mt-1 w-[16vw] text-white ml-[3vh]' to={`${sectionUrl}`}>Add new {section}</Link></>
    }

    if(token && isLoggedIn){
        return (
            <>
                <div className="fixed top-[15vh] left-[25vh] right-0 font-bold font-size-[4vh] text-5xl text-cyan-600">
                    <h1>Welcome, {userData.user.data.attributes.name}</h1>
                </div>
                <div className="ml-2 fixed top-[20vh] left-[25vh]">

                    <div className="bg-white w-[20vw] h-[17vh] inline-block rounded-[20px] shadow-black shadow-xl">
                        <label className='text-center block text-[20px] font-bold text-cyan-600 mt-1'>Jobs</label>
                        <ConditionallyRenderBtn section="job application" sectionCount={jobApplicationsCount} sectionUrl="/jobapplications/new" />
                    </div>

                    <div className="bg-white w-[20vw] h-[17vh] inline-block m-24 rounded-[20px] shadow-black shadow-xl">
                        <label className='text-center block text-[20px] font-bold text-cyan-600 mt-2'>Contacts</label>
                        <ConditionallyRenderBtn section="contact" sectionCount={contactsCount} sectionUrl="/contacts/new" />
                    </div>

                    <div className='bg-white w-[20vw] h-[17vh] inline-block rounded-[20px] shadow-black shadow-xl'>
                        <label className='text-center block text-[20px] font-bold text-cyan-600 mt-2'>Companies</label>
                        <ConditionallyRenderBtn section="company" sectionCount={companiesCount} sectionUrl="/companies/new" />
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