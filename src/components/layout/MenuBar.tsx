import logo from '../../turing-logo-gray.png';
import { useParams, NavLink, Link, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useUserLoggedContext } from '../../context/UserLoggedContext'; 

// MUI Icons
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DescriptionIcon from '@mui/icons-material/Description';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
// import plusOpen from '../../components/icons/plus-open.png';
// import plus from '../../components/icons/plus-small_4338829.png'; 

import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

function MenuBar() {
  const [sideMenuOpen, setSideMenuOpen] = useState(true)
  const toggleSideMenu = () => {
    setSideMenuOpen((previousState) => !previousState)
  }

  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const { userData } = useUserLoggedContext();
  const toggleDropDown = () => {
    setIsDropDownOpen(prevState => !prevState);
  };

  let { userId = userData.user.data.id } = useParams();
  console.log(userId);

  // A reusable function to create NavLink classes dynamically
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "m-auto text-cyan-500 transform scale-125 transition-transform duration-150"
      : "m-auto text-white transform scale-100 transition-transform duration-150";
  
  const linkClassesMobile = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "m-auto text-cyan-500 transform  transition-transform duration-150"
      : "m-auto text-white transform transition-transform duration-150";
    

  return (
    <div className='flex flex-row'>
      {/* // Menu */}
      <nav className='flex flex-col   bg-[#046576] justify-evenly h-screen  sm:w-1/12  ' >

        {/* Open button for Slideout Menu */}
        <button className="flex items-center justify-items-center" onClick={toggleSideMenu}>
          <MenuIcon data-testid="menu-iconM" fontSize="large" className="m-auto text-white justify-items-center" />
        </button>


        {/* Desktop Menu */}
        < nav className='flex flex-col fixed bg-[#046576] max-sm:hidden  justify-items-center h-screen sm:w-1/12 ' >

          {/* Logo */}
          <Link className="m-auto cursor-pointer" to="/">
            <img className="m-auto w-1/2 cursor-pointer" src={logo} alt="Logo" />
          </Link>

          {/* Home */}
          <NavLink className={linkClasses} to="/home">
            <HomeIcon data-testid="home-iconD" fontSize="large" />
          </NavLink>

          {/* Profile */}
          <NavLink className={linkClasses} to="/profile">
            <PersonIcon data-testid="profile-iconD" fontSize="large" />
          </NavLink>

          {/* Companies */}
          <NavLink className={linkClasses} to="/companies">
            <ApartmentIcon data-testid="companies-iconD" fontSize="large" />
          </NavLink>

          {/* Documents */}
          <NavLink className={linkClasses} to="/documents">
            <DescriptionIcon data-testid="applications-iconD" fontSize="large" />
          </NavLink>

          {/* Add New */}
          <NavLink className={linkClasses} to="/add-new">
            <PersonAddAlt1Icon data-testid="add-iconD" fontSize="large" />
          </NavLink>

          {/* Account */}
          <NavLink
            to="/userInformation"
            className={({ isActive }) =>
              isActive
                ? "m-auto  rounded-full bg-blue-500 text-white transform scale-150"
                : "m-auto rounded-full bg-blue-200 text-white transform scale-100"
            } data-testid="update-user">
            <PersonOutlineOutlinedIcon data-testid="updateUser-iconD" fontSize="large" />
          </NavLink>
          <div className="m-auto h-auto"></div>
        </nav >
 
{/* Slide-Out Menu */}
<nav
        className={
          "fixed top-0 left-0 z-20 bg-[#046576] bg-opacity-100 transform ease-in-out " +
          "flex flex-col justify-start items-start h-screen w-64 max-w-xs p-6 " +
          (sideMenuOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
          ) +
          " transition-all duration-300"
        }
      >
        {/* Close Button */}
        <button
          className="self-end mb-8 text-white"
          onClick={toggleSideMenu}
        >
          <CloseIcon fontSize="inherit" className="text-2xl" />
        </button>

        {/* Logo */}
        <Link to="/" className="mb-8 flex flex-col items-start">
          <img className="w-24 h-24" src={logo} alt="Logo" />
        </Link>

        {/* Nav Links */}
        <div className="flex flex-col gap-4 w-full items-start">
  <NavLink
    className={(props) =>
      `${linkClassesMobile(props)} flex items-center gap-2 w-full`
    }
    to="/home"
  >
    <HomeIcon fontSize="inherit" />
    <span className="flex-1 text-left">Home</span>
  </NavLink>

  <NavLink
    className={(props) =>
      `${linkClassesMobile(props)} flex items-center gap-2 w-full`
    }
    to="/profile"
  >
    <PersonIcon fontSize="inherit" />
    <span className="flex-1 text-left">Profile</span>
  </NavLink>

  <NavLink
    className={(props) =>
      `${linkClassesMobile(props)} flex items-center gap-2 w-full`
    }
    to="/companies"
  >
    <ApartmentIcon fontSize="inherit" />
    <span className="flex-1 text-left">Companies</span>
  </NavLink>

  <NavLink
    className={(props) =>
      `${linkClassesMobile(props)} flex items-center gap-2 w-full`
    }
    to="/job_applications"
  >
    <DescriptionIcon fontSize="inherit" />
    <span className="flex-1 text-left">Job Applications</span>
  </NavLink>

  <NavLink
    className={(props) =>
      `${linkClassesMobile(props)} flex items-center gap-2 w-full`
    }
    to="/add-new"
  >
    <PersonAddAlt1Icon fontSize="inherit" />
    <span className="flex-1 text-left">Add New Contact</span>
  </NavLink>

  <NavLink
    to="/userInformation"
    className={(props) =>
      `${linkClassesMobile(props)} flex items-center gap-2 w-full`
    }
  >
    <PersonOutlineOutlinedIcon fontSize="inherit" />
    <span className="flex-1 text-left">User Information</span>
  </NavLink>
</div>


        {/* Dropdown Menu */}
        <div className="relative flex flex-col items-start mt-8 w-full">
          <button
            className="flex items-center gap-2 text-white focus:outline-none"
            onClick={toggleDropDown}
          >
            <AddCircleIcon fontSize="inherit" /> <span>Create New...</span>
          </button>

          <ul
            className={`absolute left-0 mt-2 bg-cyan-600 shadow-md rounded-md w-full transition-all duration-300 ease-in-out ${
              isDropDownOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'
            }`}
          >
            <li className="p-2 hover:bg-gray-100 rounded text-center">
              <Link to="/newContact">Create New Contact</Link>
            </li>
            <li className="p-2 hover:bg-gray-100 rounded text-center">
              <Link to="/companies/new">Create New Company</Link>
            </li>
            <li className="p-2 hover:bg-gray-100 rounded text-center">
              <Link to="/jobapplications/new">Create New Job Application</Link>
            </li>
          </ul>
        </div>

        {/* Update Profile */}
        <Link
          to="/userInformation"
          className="mt-auto flex items-center gap-2 text-lg bg-cyan-500 text-white rounded-full p-2 w-full"
        >
          <PersonOutlineOutlinedIcon fontSize="inherit" /> <span>Update Profile</span>
        </Link>
      </nav>


      </nav>
      <div className='flex-1 m-auto'>
        <Outlet />
      </div>
    </div>
  );
}

export default MenuBar;

