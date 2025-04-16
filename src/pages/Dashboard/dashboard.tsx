import {useUserLoggedContext} from "../../context/UserLoggedContext";
import { fetchDashBoardData } from '../../constants/apiCalls';
import React, {useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import {DashBoardDattaI, CountProps} from "../../constants/Interfaces";

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
            <label className='text-center block text-[20px] font-bold text-cyan-600 mt-1'>
              {section === "contact" || section === "job application" ? `New ${section}s this week` : "New companies this week"}
            </label></>
        }

    const ConditionallyRenderBtn: React.FC<{ section: string; sectionUrl: string }> = ({ section, sectionUrl }) => {
        if (jobApplicationsCount === 0 || contactsCount === 0 || companiesCount === 0) {
            return (
                <Link
                  className="text-center text-sm sm:text-base font-bold bg-cyan-600 text-white px-4 py-2 rounded-md w-full sm:w-[80vw] md:w-[40vw] lg:w-[20vw] mx-auto"
                  to={`${sectionUrl}`}
                >
                  Add new {section}
                </Link>
              );
            }
            return null; 
        };

    if(token && isLoggedIn){
        return (
            <>
                <div className="mt-[13vh] ml-[5vw] flex flex-col md:flex-row md:flex-wrap md:justify-center gap-6">
                    <div className="w-full text-center text-xl sm:text-3xl md:text-5xl font-bold text-cyan-600 mb-8">
                        <h1>Welcome, {userData.user.data.attributes.name}</h1>
                    </div>
                    <Link to="/job_applications">
                        <div id="jobApplications" data-cy="applicationsCard" className="bg-white w-full sm:w-[90vw] md:w-[44vw] lg:w-[28vw] h-53 sm:h-52 md:h-56 mb-8 rounded-[20px] shadow-black shadow-xl">
                            <label className="text-center block text-lg sm:text-xl font-bold text-cyan-600 mt-8 mb-5 pt-5">Jobs</label>
                            <ConditionallyRenderCard section="job application" sectionCount={jobApplicationsCount} sectionDescription="New apps submitted this week" />
                        </div>
                    </Link>

                    <Link to="/contacts">
                        <div id="contacts" data-cy="contactsCard" className="bg-white w-full sm:w-[90vw] md:w-[44vw] lg:w-[28vw] h-53 sm:h-52 md:h-56 rounded-[20px] shadow-black shadow-xl">
                            <label className="text-center block text-[20px] font-bold text-cyan-600 mt-8 mb-5 pt-5">Contacts</label>
                            <ConditionallyRenderCard section="contact" sectionCount={contactsCount} sectionDescription="New connections this week"/>
                        </div>
                    </Link>

                    <Link to="/companies">
                        <div id="companies" data-cy="companiesCard" className="bg-white w-full sm:w-[90vw] md:w-[44vw] lg:w-[28vw] h-53 sm:h-52 md:h-56 rounded-[20px] shadow-black shadow-xl">
                            <label className='text-center block text-[20px] font-bold text-cyan-600 mt-8 mb-5 pt-5'>Companies</label>
                            <ConditionallyRenderCard section="company" sectionCount={companiesCount} sectionDescription="New companies this week"/>
                        </div>
                    </Link>
                    <div className="w-full mt-4">
                        <div data-cy="jobHuntingTips" className="w-full md:w-[30vw] font-size-[4vh] text-4xl text-cyan-600 mt-8">Job Hunt Tips</div>

                        <div data-cy="jobHuntTip" className="w-full md:w-[30vw] font-size-[4vh] text-2xl text-cyan-600">Try to make at least one new contact, research a new company, and apply to one job each week to keep up your momentum. You've got this!
                        </div>
                    </div>
                    <div className="w-full flex flex-wrap justify-center gap-4 mt-6">
                        <div>
                            <button data-cy="jobApplicationBtn">
                                <ConditionallyRenderBtn section="job application" sectionUrl="/jobapplications/new" />
                            </button>
                        </div>
                        <div >
                            <button data-cy="contactBtn">
                                <ConditionallyRenderBtn section="contact" sectionUrl="/contacts/new" />
                            </button>
                        </div>
                        <div>
                            <button data-cy="companyBtn">
                                <ConditionallyRenderBtn section="company" sectionUrl="/companies/new" />
                            </button>
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