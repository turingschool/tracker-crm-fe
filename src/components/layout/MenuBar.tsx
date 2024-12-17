import logo from '../../turing-logo-gray.png';
import { useParams, Outlet, NavLink} from 'react-router-dom';

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
   <div className="flex w-full h-screen">
      <div className='flex flex-col justify-items-center bg-gray-500 justify-evenly h-screen mr-10 md:w-1/6 max-w-1/6'>
        
        {/* Logo */}
        <NavLink className="m-auto cursor-pointer" to="/">
          <img className="m-auto w-1/2 cursor-pointer" src={logo} alt="Logo" />
        </NavLink>

        {/* Home */}
        <NavLink 
          className={({ isActive }) => isActive ? "m-auto text-cyan-800 transform scale-150" : "m-auto text-white transform scale-100"}
          to="/home"
        >
          <HomeIcon fontSize="large" />
        </NavLink>

        {/* Profile */}
        <NavLink 
          className={({ isActive }) => isActive ? "m-auto text-cyan-800 transform scale-150" : "m-auto text-white transform scale-100"}
          to="/profile"
        >
          <PersonIcon fontSize="large" />
        </NavLink>

        {/* Companies */}
        <NavLink 
          className={({ isActive }) => isActive ? "m-auto text-cyan-800 transform scale-150" : "m-auto text-white transform scale-100"}
          to="/companies"
        >
          <ApartmentIcon fontSize="large" />
        </NavLink>

        {/* Documents */}
        <NavLink 
          className={({ isActive }) => isActive ? "m-auto text-cyan-800 transform scale-150" : "m-auto text-white transform scale-100"}
          to="/job_applications"
        >
          <DescriptionIcon fontSize="large" />
        </NavLink>

        {/* Add New */}
        <NavLink 
          className={({ isActive }) => isActive ? "m-auto text-cyan-800 transform scale-150" : "m-auto text-white transform scale-100"} 
          to="/add-new"
        >
          <PersonAddAlt1Icon fontSize="large" />
        </NavLink>

        {/* Account */}
        <NavLink 
          className={({ isActive }) => 
            isActive 
              ? "m-auto  rounded-full bg-blue-500 text-white transform scale-150" 
              : "m-auto rounded-full bg-blue-200 text-white transform scale-100"
          } 
          to="/account"
        >
          <PersonOutlineOutlinedIcon fontSize="large" /> 
        </NavLink>

        <div className="m-auto h-auto"></div>  
  
      </div>
      <div className='flex-1 p-4'>
        <Outlet />
      </div>
    </div>
  );
}

export default MenuBar;

