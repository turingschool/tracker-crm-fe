import logo from '../../turing-logo-gray.png';
import { useParams, NavLink, Link, Outlet } from 'react-router-dom';

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
import { useState } from 'react';

function MenuBar() {
  const [sideMenuOpen, setSideMenuOpen] = useState(true)
  const toggleSideMenu = () => {
    setSideMenuOpen((previousState) => !previousState)
  }

  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const toggleDropDown = () => {
    setIsDropDownOpen(prevState => !prevState);
  };

  const { userID } = useParams();
  console.log(userID);

  // A reusable function to create NavLink classes dynamically
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "m-auto text-cyan-800 transform scale-125 transition-transform duration-150"
      : "m-auto text-white transform scale-100 transition-transform duration-150";

  return (
    <div className='md:w-1/12'>
      {/* // Menu */}
      <nav className='flex flex-col  min-sm:hidden bg-[#046576] justify-evenly h-screen  md:w-1/12  ' >

        {/* Close button for Slideout Menu */}
        <button className="flex items-center min-sm:hidden justify-items-center" onClick={toggleSideMenu}>
          <MenuIcon fontSize="large" className="m-auto text-white justify-items-center" />
        </button>

        {/* Slideout Menu */}
        <nav className={"fixed overflow-hidden min-sm:hidden  z-10 bg-opacity-100 inset-0 transform ease-in-out flex flex-col justify-items-center duration-500 bg-[#046576] justify-evenly h-screen  md:w-1/6 max-w-1/6 " + (sideMenuOpen ? " transition-opacity opacity-30 duration-500 -translate-x-full  " : " transition-all opacity-90 translate-x-0")}>

          <button className="min-sm:hidden" onClick={toggleSideMenu}>
            <CloseIcon fontSize="large" className="m-auto text-white justify-items-center" />
          </button>

          {/* Logo */}
          <Link className="m-auto cursor-pointer" to="/">
            <img className="m-auto w-1/2 cursor-pointer" src={logo} alt="Logo" />
          </Link>

          {/* Home */}
          <NavLink className={linkClasses} to="/home">
            <HomeIcon fontSize="large" />
          </NavLink>

          {/* Profile */}
          <NavLink className={linkClasses} to="/profile">
            <PersonIcon fontSize="large" />
          </NavLink>

          {/* Companies */}
          <NavLink className={linkClasses} to="/companies">
            <ApartmentIcon fontSize="large" />
          </NavLink>

          {/* Documents */}
          <NavLink className={linkClasses} to="/documents">
            <DescriptionIcon fontSize="large" />
          </NavLink>

          {/* Add New */}
          <NavLink className={linkClasses} to="/add-new">
            <PersonAddAlt1Icon fontSize="large" />
          </NavLink>

          {/* Account */}
          <NavLink
            to="/userInformation"
            className={({ isActive }) =>
              isActive
                ? "m-auto  rounded-full bg-blue-500 text-white transform scale-150"
                : "m-auto rounded-full bg-blue-200 text-white transform scale-100"
            }
            data-testid="update-user"
          >
            <PersonOutlineOutlinedIcon fontSize="large" />
          </NavLink>

          {/* Drop Down Shortcut Menu */}
          <div className="flex mt-auto flex-col items-center justify-center relative">
            <button className="flex items-center justify-items-center" onClick={toggleDropDown}>
              <AddCircleIcon fontSize="large" className="m-auto text-white justify-items-center" />
            </button>

            <ul className={`bg-cyan-600 m-4 shadow-md rounded-md transition-all duration-700 ease-in-out transform ${isDropDownOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'
              }`}>
              <li className="p-2 hover:bg-gray-100 rounded text-center mb-2 font-[Helvetica Neue]">
                <Link to="/newContact">Create New Contact</Link>
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
          <Link to="/userInformation"
            className="m-auto mt-[10vh] text-[2.5vw] cursor-pointer rounded-full"
            data-testid="update-user">
            <PersonOutlineOutlinedIcon fontSize="large" className="m-auto w-1/5 rounded-full bg-cyan-500 text-white" />
          </Link>

          <div className="m-auto h-auto"></div>
        </nav >

        {/* Desktop Menu */}
        < nav className='flex flex-col fixed bg-[#046576] max-sm:hidden  justify-items-center h-screen md:w-1/12 ' >

          {/* Logo */}
          <Link className="m-auto cursor-pointer" to="/">
            <img className="m-auto w-1/2 cursor-pointer" src={logo} alt="Logo" />
          </Link>

          {/* Home */}
          <NavLink className={linkClasses} to="/home">
            <HomeIcon fontSize="large" />
          </NavLink>

          {/* Profile */}
          <NavLink className={linkClasses} to="/profile">
            <PersonIcon fontSize="large" />
          </NavLink>

          {/* Companies */}
          <NavLink className={linkClasses} to="/companies">
            <ApartmentIcon fontSize="large" />
          </NavLink>

          {/* Documents */}
          <NavLink className={linkClasses} to="/documents">
            <DescriptionIcon fontSize="large" />
          </NavLink>

          {/* Add New */}
          <NavLink className={linkClasses} to="/add-new">
            <PersonAddAlt1Icon fontSize="large" />
          </NavLink>

          {/* Account */}
          <NavLink
            to="/userInformation"
            className={({ isActive }) =>
              isActive
                ? "m-auto  rounded-full bg-blue-500 text-white transform scale-150"
                : "m-auto rounded-full bg-blue-200 text-white transform scale-100"
            } data-testid="update-user">
            <PersonOutlineOutlinedIcon fontSize="large" />
          </NavLink>
          <div className="m-auto h-auto"></div>
          <div className='flex-1 p-4'>
            <Outlet />
          </div>
        </nav >
      </nav>
    </div>
  );
}

export default MenuBar;
