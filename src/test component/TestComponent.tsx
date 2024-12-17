import React from "react";
import { useContext } from "react";
import { useUserLoggedContext } from "../context/UserLoggedContext.tsx";
interface TestProps {
  isLoggedIn: boolean,
  userData: {id: number, email: string}
}

export const TestComponent: React.FC<TestProps> = (testProps: TestProps) => {
  const {isLoggedIn, userData} = testProps
  const values = useUserLoggedContext();
  return (
    <div className='w-[50vw] h-[50vh] flex flex-col'>
      {/* {console.log(isLoggedIn, userData, values, '<-- CHECK HERE')} */}
      <h1>I Am Here For Testing Purposes</h1>
      {isLoggedIn ? <h2>isLoggedIn is: True</h2> : <h2>isLoggedIn is: False</h2>}
      {userData ? <h2>userData is: True</h2> : <h2>userData is: False</h2>}
      {userData ? <div className=''>
                    {userData.id ? <p>{`This is the user's ID: ${userData.id}`}</p> : <p>{`The User's ID in Nada.`}</p>}
                  </div> : 
        <h2>userData is: False</h2>
      }
      {userData ? <div className=''>
                    {userData.email ? <p>{`This is the user's User Name: ${userData.email}`}</p> : <p>{`The User's User Name in Nada.`}</p>}
                  </div> : 
        <h2>userData is: False</h2>
      }
      {<p>{`User's token is: ${values.token}`}</p>}
    </div>
  )
};

export default TestComponent;