import logo from '../../turing-logo-gray.png';
import { useParams, Link } from 'react-router-dom';

// MUI Icons
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DescriptionIcon from '@mui/icons-material/Description';
import AddCircleIcon from '@mui/icons-material/AddCircle';
// import plusOpen from '../../components/icons/plus-open.png';
// import plus from '../../components/icons/plus-small_4338829.png'; 

import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useState } from 'react';

function MenuBar() {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const toggleDropDown = () => {
    setIsDropDownOpen((previousState) => !previousState)
  }
  const { userID } = useParams();
  console.log(userID);

  return (
    <div className='flex flex-col justify-items-center bg-gray-500 justify-evenly h-screen mr-10 md:w-1/6 max-w-1/6'>
      
      {/* Logo */}
      <Link className="m-auto cursor-pointer" to="/">
        <img className="m-auto w-1/2 cursor-pointer" src={logo} alt="Logo" />
      </Link>

      {/* Home */}
      <Link className="m-auto cursor-pointer" to="/home">
        <HomeIcon fontSize="large" className="m-auto text-white" />
      </Link>

      {/* Profile */}
      {/* <Link className="m-auto cursor-pointer" to="/profile">
        <PersonIcon fontSize="large" className="m-auto text-white" />
      </Link> */}

      {/* Companies */}
      <Link className="m-auto cursor-pointer" to="/companies">
        <ApartmentIcon fontSize="large" className="m-auto text-white" />
      </Link>

      {/* Contacts */}
      <Link className="m-auto cursor-pointer" to="/contacts">
        <PersonIcon fontSize="large" className="m-auto text-white" />
      </Link>

      {/* Documents */}
      <Link className="m-auto cursor-pointer" to="/documents">
        <DescriptionIcon fontSize="large" className="m-auto text-white" />
      </Link>

      {/* Add New */}
      <Link className="m-auto cursor-pointer" to="/add-new">
        <PersonAddAlt1Icon fontSize="large" className="m-auto text-white" />
      </Link>

      {/* Account */}
      <Link className="m-auto cursor-pointer" to="/account">
        <PersonOutlineOutlinedIcon fontSize="large" className="m-auto w-1/5 rounded-full bg-blue-200 text-white" />
      </Link>

      {/* Drop Down Shortcut Menu */}
      <div className="flex flex-col items-center justify-center relative">
        <button className="flex items-center justify-items-center" onClick={toggleDropDown}>
          <AddCircleIcon fontSize="large" className="m-auto text-white justify-items-center" />
        </button>
        
        <ul
          className={`bg-cyan-600 m-4 shadow-md rounded-md transition-all duration-700 ease-in-out transform ${
            isDropDownOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'
          }`}
        >
          <li className="p-2 hover:bg-gray-100 rounded text-center mb-2 font-[Helvetica Neue]">
            <Link to="/contacts/new">Create New Contact</Link>
          </li>
          <li className="p-2 hover:bg-gray-100 rounded text-center mb-2 font-[Helvetica Neue]">
            <Link to="/companies/new">Create New Company</Link>
          </li>
          <li className="p-2 hover:bg-gray-100 rounded text-center font-[Helvetica Neue]">
            <Link to="/jobapplications/new">Create New Job Application</Link>
          </li>
        </ul>
      </div>



      <div className="m-auto h-auto"></div>  
    </div>
  );
}

export default MenuBar;