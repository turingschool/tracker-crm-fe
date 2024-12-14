import home from '../../components/icons/home_738822.png';
import logo from '../../turing-logo-gray.png';
import person from '../../components/icons/person-icon.png';
import building from '../../components/icons/building-1062.png';
import plus from '../../components/icons/plus-small_4338829.png';
import plusOpen from '../../components/icons/plus-open.png';
import papers from '../../components/icons/documents-symbol_35920.png';
import { useState } from 'react';
import { Link } from 'react-router-dom';


function MenuBar() {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const toggleDropDown = () => {
    setIsDropDownOpen((previousState) => !previousState)
  }

  return (

    <div className='flex flex-col justify-items-center  bg-gray-500  justify-evenly h-screen mr-10 md:w-1/6 max-w-1/6'>
      <a className="m-auto  cursor-pointer" href="https://www.google.com/search?q=Turing.edu">
        <img className="m-auto w-1/2 cursor-pointer" src={logo}>
        </img>
      </a>
      <a className="m-auto  cursor-pointer" href="https://www.google.com/search?q=home">
        <img className="m-auto w-1/4 cursor-pointer" src={home}>
        </img>
      </a>

      <a className="m-auto  cursor-pointer" href="https://www.google.com/search?q=person">
        <img className="m-auto w-1/4 cursor-pointer" src={person}>
        </img>
      </a>

      <a className="m-auto  cursor-pointer" href="https://www.google.com/search?q=building">

        <img className="m-auto w-1/4 cursor-pointer" src={building}>
        </img>
      </a>
      <a className="m-auto  cursor-pointer" href="https://www.google.com/search?q=papers">

        <img className="m-auto w-1/4 cursor-pointer" src={papers}>
        </img>
      </a>

      <div className='dropDownPlus'>
        <button className="m-auto cursor-pointer" onClick={toggleDropDown}>
          <img
            className="m-auto w-1/4 cursor-pointer"
            src={isDropDownOpen ? plusOpen : plus}
            alt="Teal Plus Icon"
          />
        </button>
        
        <ul
          className={`bg-cyan-600 m-4 shadow-md rounded-md transition-all duration-700 ease-in-out transform ${
            isDropDownOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'
          }`}
        >
          <li className="p-2 hover:bg-gray-200 rounded text-center mb-2">
            <Link to="/newContact">Create New Contact</Link>
          </li>
          <li className="p-2 hover:bg-gray-200 rounded text-center mb-2">
            <Link to="/companies/new">Create New Company</Link>
          </li>
          <li className="p-2 hover:bg-gray-200 rounded text-center">
            <Link to="/jobapplications/new">Create New Job Application</Link>
          </li>
        </ul>
      </div>

      <a className="m-auto  cursor-pointer" href="https://www.google.com/search?q=account">

        <img className="m-auto w-1/5  rounded-full bg-blue-200 cursor-pointer" src={person}>
        </img>
      </a>
      <div className='m-auto h-auto '>
      </div>

    </div>
  );
}

export default MenuBar;