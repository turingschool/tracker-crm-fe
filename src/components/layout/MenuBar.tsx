import logo from '../../turing-logo-gray.png';
import { useParams, NavLink, Link, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useUserLoggedContext } from '../../context/UserLoggedContext.tsx'; 

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
      </nav>

      {/* This is where nested routes will render. */}
      <div className="flex-grow p-4">
        <Outlet />
      </div>
    </div>
  );
}

export default MenuBar;
