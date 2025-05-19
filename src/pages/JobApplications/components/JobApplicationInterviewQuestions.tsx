import {useUserLoggedContext} from "../../../context/UserLoggedContext";
import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { fetchInterviewQuestions } from "../../../constants/trackerApiCalls";
import { ChatGPTQuestion } from "../../../constants/Interfaces";
import ClipLoader from 'react-spinners/ClipLoader';

const JobApplicationInterviewQuestions: React.FC = () => {
  const { token, userData } = useUserLoggedContext();
  const [chatgptQuestions, setChatgptQuestions] = useState<ChatGPTQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation()
  const positionTitle = location.state.positionTitle
  const companyId = location.state.companyId
  const companyName = location.state.companyName
  const jobAppId = location.state.jobAppId
  const jobDescription = location.state.jobDescription

  useEffect(() => {
    const getInterviewQuestions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchInterviewQuestions(userData.user.data.id, jobAppId, token || "");

        if (result.data) {
          console.log("Question data structure:", result.data);
          setChatgptQuestions(result.data);
        } else if (result.error) {
          console.error("Error fetching questions: ", result.error);
          setError("Failed to fetch interview questions. Please try again.");          
        }
      } catch (error) {
        console.error('Error: ', error);
        setError("An error occurred while fetching interview questions."); 
      } finally {
        setIsLoading(false)
      }
    };
    if (jobDescription && token) {
      getInterviewQuestions()
    }
  }, [jobDescription, token, userData.user.data.id]);

  const startRecording = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const stopButton = event.currentTarget.parentElement?.querySelector(".invisible")
    event.currentTarget.classList.add("invisible")
    stopButton?.classList.remove("invisible")

    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia(
        {
          audio: true
        }
      ).then((stream) => {
        const mediaRecorder = new MediaRecorder(stream)
        let chunks: Blob[] = []

        mediaRecorder.start()
        console.log(mediaRecorder.state)

        stopButton?.addEventListener('click', () => {
          mediaRecorder.stop()
          console.log(mediaRecorder.state)
          console.log(chunks)
        })

        mediaRecorder.ondataavailable = (blobEvent) => {
          chunks.push(blobEvent.data)
        }

        mediaRecorder.onstop = () => {
          const clipContainer = stopButton?.parentElement
          const audio = document.createElement("audio")

          audio.setAttribute("controls", "")
          clipContainer?.appendChild(audio)

          const blob: Blob = new Blob(chunks, {type: "audio/ogg; codecs=opus"})
          const audioUrl = window.URL.createObjectURL(blob)
          audio.src = audioUrl
        }

      })
      .catch((err) => {
        console.log(`The following error occurred: ${err}`)
      })
    } else {
      console.log("unsupported browser")
    }
  }

return (
    <div className="min-h-screen p-4 sm:p-8 pt-8 sm:pt-36">
        <main>
          <h1 className="text-cyan-600 text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4">
            {positionTitle}
          </h1>
          <h2 className="text-[3.5vh] font-bold text-cyan-500 hover:text-cyan-700 p-0 hover:underline">
            {companyName}
          </h2>
          <Link className="font-bold text-cyan-800 hover:text-cyan-700 p-0 hover:underline" to={`/companies/${companyId}/contacts`}>
          </Link>
          < Link to={`/job_applications/${jobAppId}`}>
            <h3 className="underline underline-offset-[7px] text-cyan-600 text-[2.3vh]">
              Back to job application details 
            </h3>
          </Link>
          <h4 className="mt-10 text-[20px] font-bold text-cyan-600 tracking-wide">
            Technical Interview Questions
          </h4>
          {error && (
            <div data-testid="error-message" className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          { isLoading ? (
            <div data-testid="loading-spinner" className="flex flex-col items-center justify-center mt-8 space-y-4">
              <ClipLoader
                color={"#0891b2"} // matches text-cyan-600
                loading={isLoading}
                size={50}
                aria-label="Generating Interview Questions"
              />
              <p className="text-cyan-600 text-lg">Generating your custom interview questions. This may take a few moments.</p>
            </div>
          ) : ( 
            <ul data-testid="interview-questions-list"> 
              { chatgptQuestions.map((question) => ( 
                <li key={question.index} className="ml-5 text-gray-600 w-1/2 text-[17px]">
                  <br></br>
                  {question.index}. {question.attributes.question}
                  <br/>
                  <button onClick={(event) => {startRecording(event)}} className="text-cyan-600 text-[1.8vh]">Record your Answer</button>
                  <br/>
                  <button className="text-red-500 text-[1.8h] invisible">Stop Recording</button>
                </li>
              ))}
            </ul>
          )}
        </main>
    </div>
  );
}

export default JobApplicationInterviewQuestions