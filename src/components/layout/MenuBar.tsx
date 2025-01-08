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
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

function MenuBar() {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const { userData } = useUserLoggedContext();
  const toggleDropDown = () => {
    setIsDropDownOpen(prevState => !prevState);
  };

  let { userId = userData.user.data.id } = useParams();
  console.log(userId);

  // A reusable function to create NavLink classes dynamically
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "m-auto text-cyan-800 transform scale-125 transition-transform duration-150"
      : "m-auto text-white transform scale-100 transition-transform duration-150";
  const mobileClasses = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "ml-[25vw] mt-4 text-cyan-500 transform translate-x-20 scale-125 transition-transform duration-150"
      : "ml-[25vw] mt-4 text-white transform scale-100 transition-transform duration-150";


  return (
    <div className="flex flex-row h-screen">
      <nav className="flex flex-col justify-items-center bg-gray-500 justify-evenly h-full mr-10 md:w-1/6 max-w-1/6">
        
        {/* Logo */}
        <Link className="m-auto cursor-pointer" to="/">
          <img className="m-auto w-1/2 cursor-pointer" src={logo} alt="Logo" />
        </Link>

        {/* Home */}
        <NavLink className={linkClasses} to="/home">
          <HomeIcon fontSize="large" />
        </NavLink>

          {/* Contacts */}
          <NavLink className={linkClasses} to="/contacts">
            <PersonIcon data-testid="contacts-iconD" fontSize="large" />
          </NavLink>

        {/* Companies */}
        <Link className="m-auto cursor-pointer" to="/companies">
          <ApartmentIcon fontSize="large" className="m-auto text-white" />
        </Link>

          {/* Documents */}
          <NavLink className={linkClasses} to="/job_applications">
            <DescriptionIcon data-testid="applications-iconD" fontSize="large" />
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
                ? "m-auto rounded-full bg-blue-500 text-white transform scale-150"
                : "m-auto rounded-full bg-blue-200 text-white transform scale-100"
            } data-testid="update-user">
            <PersonOutlineOutlinedIcon data-testid="updateUser-iconD" fontSize="large" />
          </NavLink>
          <div className="m-auto h-auto"></div>
        </nav >
        {/* Slideout Menu */}

        <nav className={"fixed overflow-hidden min-sm:invisible min-sm:hidden  z-10 bg-opacity-100 inset-0 transform ease-in-out flex flex-col justify-items-center duration-500 bg-[#046576] justify-evenly h-screen  sm:w-1/6 max-w-1/6 " + (sideMenuOpen ? " transition-opacity opacity-80 duration-500 -translate-x-full  " : " transition-all opacity-100 -translate-x-20")}>

          <button className="min-sm:hidden" onClick={toggleSideMenu}>
            <CloseIcon fontSize="large" data-testid="close-iconM" className="m-auto text-white justify-items-center" />
          </button>

          {/* Logo */}
          <Link className="m-auto cursor-pointer" to="/">
            <img className="m-auto w-1/2 cursor-pointerM" src={logo} alt="Logo" />
          </Link>

          {/* Home */}
          <NavLink className={mobileClasses} to="/home">
            <HomeIcon data-testid="home-iconM" fontSize="large" />
            Home
          </NavLink>

          {/* Contacts */}
          <NavLink className={mobileClasses} to="/contacts">
            <PersonIcon data-testid="contacts-iconM" fontSize="large" />
            Contacts
          </NavLink>

          {/* Companies */}
          <NavLink className={mobileClasses} to="/companies">
            <ApartmentIcon data-testid="companies-iconM" fontSize="large" />
            Companies
          </NavLink>

          {/* Job Apps */}
          <NavLink className={mobileClasses} to="/job_applications">
            <DescriptionIcon data-testid="applications-iconM" fontSize="large" />
            Job Applications
          </NavLink>

          {/* Add New */}
          <NavLink className={mobileClasses} to="/add-new">
            <PersonAddAlt1Icon data-testid="add-iconM" fontSize="large" />
            Add New Contact
          </NavLink>

          {/* Account */}
          <NavLink
            to="/userInformation"
            className={({ isActive }) =>
              isActive
                ? "ml-[25vw] mt-4  rounded-full text-cyan-500 transform translate-x-20 transition-transform duration-150 scale-125"
                : "ml-[25vw] mt-4 rounded-full  text-white transform scale-100"
            } data-testid="update-userM">
            <PersonOutlineOutlinedIcon data-testid="updateUser-iconM" fontSize="large" />
            User Information
          </NavLink>

          {/* Drop Down Shortcut Menu */}
          <div className="flex ml-[25vw] mt-4 flex-col items-start justify-start relative">
            <button className="flex items-center justify-items-center text-white" onClick={toggleDropDown}>
              <AddCircleIcon data-testid="newmenu-iconM" fontSize="large" className="m-auto text-white justify-items-center" />
              Create New...
            </button>

            <ul className={`bg-cyan-600 m-4 shadow-md rounded-md transition-all duration-700 ease-in-out transform ${isDropDownOpen ? 'scale-100  opacity-100 visible' : 'scale-95 opacity-0 invisible'
              }`}>
              <li className="p-2 hover:bg-gray-100 rounded text-center mb-2 font-[Helvetica Neue]">
                <Link data-testid="newContactLink" to="/newContact">Create New Contact</Link>
              </li>
              <li className="p-2 hover:bg-gray-100 rounded text-center mb-2 font-[Helvetica Neue]">
                <Link data-testid="newCompanyLink" to="/companies/new">Create New Company</Link>
              </li>
              <li className="p-2 hover:bg-gray-100 rounded text-center font-[Helvetica Neue]">
                <Link data-testid="newAppLink" to="/jobapplications/new">Create New Job Application</Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <Link to="/userInformation"
            className="m-auto mt-[10vh] text-[2.5vw] cursor-pointer text-white rounded-full"
            data-testid="update-userM">
            <PersonOutlineOutlinedIcon fontSize="large" className="m-auto w-1/5 rounded-full bg-cyan-500 text-white" />
            Update Profile
          </Link>

          <div className="m-auto h-auto"></div>
        </nav >

      </nav>
      
      {/* This is where nested routes will render. */}
      <div className="flex-grow p-4">
        <Outlet />
      </div>
    </div>
  );
}

export default MenuBar;
