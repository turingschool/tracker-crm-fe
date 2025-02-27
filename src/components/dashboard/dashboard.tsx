import {useUserLoggedContext} from "../../context/UserLoggedContext";
import { fetchDashBoardData } from '../../apiCalls';
import React, {useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import {DashBoardDattaI, CountProps} from "../../Interfaces";

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

    useEffect(()=>{

        const dashDataFetcher = async () => {
            try {
                const allData = await fetchDashBoardData(userData.user.data.id, token)
                return await setDashData(allData)

            } catch (error) {
            }
        };
        dashDataFetcher()

    },[])

    const ConditionallyRenderCard: React.FC<CountProps> = ({ section, sectionCount = 0, sectionDescription}) => {
        if (sectionCount >= 1) {
            return <><label className='text-center block mt-1 font-bold text-[50px] text-cyan-600' data-cy="dashNum">{`${sectionCount}`}</label>
            <label className='text-center block text-[20px] font-bold text-cyan-600 mt-1'>{`${sectionDescription}`}</label></>
        }
        return <><label className='text-center block mt-1 font-bold text-[50px] text-cyan-600' data-cy="dashNum">{`${sectionCount}`}</label>
            <label className='text-center block text-[20px] font-bold bg-cyan-600 mt-1 w-[16vw] text-white ml-[3vh]'>New  {section}s this week</label></>
        }

    const ConditionallyRenderBtn: React.FC<CountProps> = ({ section, sectionCount = 0, sectionUrl }) => {
        if (sectionCount === 0) {
            return (
                <Link
                    className="text-center block text-[20px] font-bold bg-cyan-600 mt-1 w-[16vw] text-white ml-[3vh]"
                    to={`${sectionUrl}`}
                >
                    Add new {section}
                </Link>
            );
        }
        return <div></div>;
    };

    if(token && isLoggedIn){
        return (
            <>
                <div className="fixed top-[15vh] left-[25vh] right-0 font-bold font-size-[4vh] text-5xl text-cyan-600">
                    <h1>Welcome, {userData.user.data.attributes.name}</h1>
                </div>
                <div className="ml-2 fixed top-[20vh] left-[25vh]">
                    <Link to="/job_applications">
                        <div id="jobApplications" className="bg-white w-[20vw] h-[17vh] inline-block rounded-[20px] shadow-black shadow-xl">
                            <label className='text-center block text-[20px] font-bold text-cyan-600 mt-1'>Jobs</label>
                            <ConditionallyRenderCard section="job application" sectionCount={jobApplicationsCount} sectionDescription="New apps submitted this week" />
                        </div>
                    </Link>

                    <Link to="/contacts">
                        <div id="contacts" className="bg-white w-[20vw] h-[17vh] inline-block m-24 rounded-[20px] shadow-black shadow-xl">
                            <label className='text-center block text-[20px] font-bold text-cyan-600 mt-2'>Contacts</label>
                            <ConditionallyRenderCard section="contact" sectionCount={contactsCount} sectionDescription="New connections this week"/>
                        </div>
                    </Link>

                    <Link to="/companies">
                        <div id="companies" className='bg-white w-[20vw] h-[17vh] inline-block rounded-[20px] shadow-black shadow-xl'>
                            <label className='text-center block text-[20px] font-bold text-cyan-600 mt-2'>Companies</label>
                            <ConditionallyRenderCard section="company" sectionCount={companiesCount} sectionDescription="New companies this week"/>
                        </div>
                    </Link>
                    <div className="font-size-[4vh] text-4xl text-cyan-600">Job Hunt Tips</div>

                    <div className="font-size-[4vh] text-2xl text-cyan-600">Try to make at least one new contact, research a new company, and apply to one job each week so you don't lose your momentum.  You've got this!
                        <div data-cy="jobApplicationBtn">
                        <ConditionallyRenderBtn section="job application" sectionCount={jobApplicationsCount} sectionUrl="/jobapplications/new" />
                        </div>
                        <div  data-cy="contactBtn">
                        <ConditionallyRenderBtn sectionCount={contactsCount}  section="contact" sectionUrl="/contacts/new" />
                        </div>
                        <div data-cy="companyBtn">
                        <ConditionallyRenderBtn section="company" sectionCount={companiesCount} sectionUrl="/companies/new" />
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <>
                <label className="fixed top-[15vh] left-[25vh] right-0 font-bold font-size-[4vh] text-5xl text-cyan-600">Please try again later</label>
            </>
        )
    }

}

export default DashBoard;