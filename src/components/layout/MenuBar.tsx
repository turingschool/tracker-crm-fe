import logo from '../../turing-logo-gray.png';
import { useParams, NavLink, Link, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useUserLoggedContext } from '../../context/UserLoggedContext'; 

// MUI Icons
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';
// import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DescriptionIcon from '@mui/icons-material/Description';
import AddCircleIcon from '@mui/icons-material/AddCircle';
// import MenuIcon from '@mui/icons-material/Menu';
// import CloseIcon from '@mui/icons-material/Close';
// import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function MenuBar() {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const { userData } = useUserLoggedContext();
  const toggleDropDown = () => {
    setIsDropDownOpen(prevState => !prevState);
  };

  let { userId = userData.user.data.id } = useParams();
  console.log(userId);

  // A reusable function to create NavLink classes dynamically
  // const linkClasses = ({ isActive }: { isActive: boolean }) =>
  //   isActive
  //     ? "m-auto text-cyan-800 transform scale-150 transition-transform duration-150"
  //     : "m-auto text-gray-500 transform scale-125 transition-transform duration-150";

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "m-auto mt-[3vh] text-cyan-800 transform scale-150 transition-transform duration-150"
      : "m-auto mt-[3vh] text-gray-500 transform scale-125 transition-transform duration-150";

  return (
    <div className="flex flex-row h-screen">
      <nav className="flex flex-col justify-items-center justify-evenly h-full w-28">
        
        {/* Logo */}
        <Link className="m-auto cursor-pointer" to="/">
          <img className="m-auto cursor-pointer" src={logo} alt="Logo" />
        </Link>

        {/* Home */}
        <NavLink className={linkClasses} to="/home">
          <HomeIcon fontSize="large" />
        </NavLink>

        {/* Contacts */}
        <NavLink className={linkClasses} to="/contacts">
          <PersonIcon fontSize="large" />
        </NavLink>

        {/* Companies */}
        <NavLink className={linkClasses} to="/companies">
          <ApartmentIcon fontSize="large" />
        </NavLink>

        {/* Job Apps */}
        <NavLink className={linkClasses} to="/job_applications">
          <DescriptionIcon fontSize="large" />
        </NavLink>

      {/* Drop Down Shortcut Menu */}
      <div className="flex flex-col items-center justify-center relative">
        <button className="flex items-center justify-items-center" onClick={toggleDropDown}>
          <AddCircleIcon fontSize="large" className="m-auto text-gray-500 justify-items-center mt-7" />
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

        {/* Account */}
        <NavLink
          to="/userInformation"
          className={({ isActive }) =>
            isActive 
          ? "m-auto  rounded-full bg-cyan-800 text-white " 
          : "m-auto rounded-full text-gray-500 transform scale-100"
          }
          data-testid="update-user"
        >
          <AccountCircleIcon fontSize="large" />
        </NavLink>

      </nav>
      <div className='quad-color-bar flex flex-col w-2 h-[100%]'>
        <div className='cyan-bar bg-cyan-500 w-[100%] h-[25%]'/>
        <div className='yellow-bar bg-yellow-500 w-[100%] h-[25%]'/>
        <div className='red-bar bg-red-500 w-[100%] h-[25%]'/>
        <div className='green-bar bg-green-500 w-[100%] h-[25%]'/>
      </div>
      
      {/* This is where nested routes will render. */}
      <div className="flex-grow p-4">
        <Outlet />
      </div>


    </div>
  );
}

export default MenuBar;
