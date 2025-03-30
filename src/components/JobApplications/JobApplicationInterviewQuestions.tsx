import {useUserLoggedContext} from "../../context/UserLoggedContext";
import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { fetchInterviewQuestions } from "../../trackerApiCalls";

const JobApplicationInterviewQuestions: React.FC = () => {
  // const apiURL = process.env.REACT_APP_BACKEND_API_URL
  // const backendURL = `${apiURL}api/v1/`
  const { token } = useUserLoggedContext();
  const [chatgptQuestions, setChatgptQuestions] = useState<ChatGPTQuestion[]>([]);
  const location = useLocation()
  const positionTitle = location.state.positionTitle
  const companyId = location.state.companyId
  const companyName = location.state.companyName
  const jobAppId = location.state.jobAppId
  const jobDescription = location.state.jobDescription

// interface APIResponse {
//   id: string;
//   data: ChatGPTQuestion[];
// }

interface ChatGPTQuestion {
  index: number;
  type: string;
  attributes: {
    question: string;
  };
}
  useEffect(() => {
    const getInterviewQuestions = async () => {
      try {
        const result = await fetchInterviewQuestions(jobDescription, token);

        if (result.data) {
          setChatgptQuestions(result.data);
        } else if (result.error) {
          console.error("Error fetching questions: ", result.error);          
        }
      } catch (error) {
        console.error('Error: ', error); 
      }
    };
    if (jobDescription && token) {
      getInterviewQuestions()
    }
  }, [jobDescription, token]); 
    // const fetchJobData = async (jobDescription: string, token: string | null) => {
    //   try {
    //     const response = await fetch(`${backendURL}interview_questions`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${token}`,
    //       },
    //       body: JSON.stringify({description: jobDescription}),
    //     });
    //     const result = await response.json();
    //     setChatgptQuestions(result.data);
    //     console.log("chat gpt questions", result.data)
    //   } catch (error) {
    //     console.error('Error:', error);
    //   }
    // };

  //   fetchJobData(jobDescription, token);
  // }, [jobDescription, token, backendURL]); 

// interface DummyQuestions {
//   id: number;
//   text: string;
// }

// const questions :DummyQuestions[] = [
//   { id: 1, text: "Can you explain the difference between state and props in React?" },
//   { id: 2, text: "Given a React component that fetches data from an API, how would you manage loading, success, and error states?" },
//   { id: 3, text: "How would you handle form submission and validation in a React application?" },
//   { id: 4, text: "How does JavaScript handle asynchronous operations? Can you explain async/await and provide an example?" },
//   { id: 5, text: "What are some techniques to improve performance in a React application?" },
//   { id: 6, text: "How would you define a RESTful API in Ruby on Rails?" },
//   { id: 7, text: "Given a User model with has_many :bookings, how would you retrieve all bookings for a user in Rails?" },
//   { id: 8, text: "How would you implement authentication in a Rails API using Devise or JWT?" },
//   { id: 9, text: "Given an array of integers, write a function that returns the two numbers that sum to a given target." },
//   { id: 10, text: "Imagine you're working on a React/Rails app and an API request fails with a 500 error. How would you go about debugging the issue?" }
// ]

// const questionObject = questions.reduce((acc, question) => {
//   acc[question.id] = question.text 
//   return acc
// }, {} as Record<number, string>);

return (
    <div className="min-h-screen p-4 sm:p-8 pt-8 sm:pt-36">
        <main>
          <h1 className="text-cyan-600 text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4">
            {positionTitle}
          </h1>
          <Link className="font-bold text-cyan-800 hover:text-cyan-700 p-0 hover:underline" to={`/companies/${companyId}/contacts`}>
            <h2 className="text-[3.5vh] font-bold text-cyan-500 hover:text-cyan-700 p-0 hover:underline">
              {companyName}
            </h2>
          </Link>
          < Link to={`/job_applications/${jobAppId}`}>
            <h3 className="underline underline-offset-[7px] text-cyan-600 text-[2.3vh]">
              Back to job application details 
            </h3>
          </Link>
          <h4 className="mt-10 text-[20px] font-bold text-cyan-600 tracking-wide">
            Technical Interview Questions
          </h4>
          {chatgptQuestions.map((question) => (
            <div key={question.index} data-testid="interview-question-list" className="ml-5 text-gray-600 w-1/2 text-[17px]">
              <br>
              </br>
              {question.index}. {question.attributes.question}
            </div>
          ))}
        </main>
    </div>
  );
}

export default JobApplicationInterviewQuestions