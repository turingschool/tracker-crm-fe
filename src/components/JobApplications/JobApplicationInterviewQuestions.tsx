
const JobApplicationInterviewQuestions: React.FC = () => {

interface DummyQuestions {
  id: number;
  text: string;
}

const questions :DummyQuestions[] = [
  { id: 1, text: "Can you explain the difference between state and props in React?" },
  { id: 2, text: "Given a React component that fetches data from an API, how would you manage loading, success, and error states?" },
  { id: 3, text: "How would you handle form submission and validation in a React application?" },
  { id: 4, text: "How does JavaScript handle asynchronous operations? Can you explain async/await and provide an example?" },
  { id: 5, text: "What are some techniques to improve performance in a React application?" },
  { id: 6, text: "How would you define a RESTful API in Ruby on Rails?" },
  { id: 7, text: "Given a User model with has_many :bookings, how would you retrieve all bookings for a user in Rails?" },
  { id: 8, text: "How would you implement authentication in a Rails API using Devise or JWT?" },
  { id: 9, text: "Given an array of integers, write a function that returns the two numbers that sum to a given target." },
  { id: 10, text: "Imagine you're working on a React/Rails app and an API request fails with a 500 error. How would you go about debugging the issue?" }
]

const questionObject = questions.reduce((acc, question) => {
  acc[question.id] = question.text 
  return acc
}, {} as Record<number, string>);

return (
    <div className="min-h-screen p-4 sm:p-8 pt-8 sm:pt-36">
        <main>
          <h3 className='text-[20px] font-bold text-cyan-600 tracking-wide'>
            Technical Interview Questions
          </h3>
          {Object.entries(questionObject).map(([id, text]) => (
            <div key={id} className="ml-5 text-gray-600 w-1/2">
              <br>
              </br>
              {id}. {text}
            </div>
          ))}
        </main>
    </div>
  );
}

export default JobApplicationInterviewQuestions