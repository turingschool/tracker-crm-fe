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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function MenuBar() {
  const [sideMenuOpen, setSideMenuOpen] = useState(true);
  const toggleSideMenu = () => {
    setSideMenuOpen((previousState) => !previousState);
  };

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const { userData } = useUserLoggedContext();
  const toggleDropDown = () => {
    setIsDropDownOpen((prevState) => !prevState);
  };

  let { userId = userData.user.data.id } = useParams();
  console.log(userId);

  // A reusable function to create NavLink classes dynamically
 // A reusable function to create NavLink classes dynamically
const linkClasses = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "m-auto text-cyan-800 mt-16 transform scale-150 transition-transform duration-150"
    : "m-auto text-gray-500 mt-16 transform scale-125 transition-transform duration-150";

  return (
    <div className="flex h-screen">
      
      {/* -- DESKTOP NAV (non-fixed), hidden on small screens -- */}
      <nav className="hidden sm:flex flex-col justify-items-center justify-evenly h-screen ml-5 mr-4 w-28">
        {/* Logo */}
        <Link className="m-auto cursor-pointer mt-4" to="/">
          <img className="m-auto cursor-pointer" src={logo} alt="Logo" />
        </Link>

        {/* Home */}
        <NavLink className={linkClasses} to="/home" data-testid="home-iconD">
          <HomeIcon fontSize="large" />
        </NavLink>

        {/* Contacts */}
        <NavLink className={linkClasses} to="/contacts" data-testid="contacts-iconD">
          <PersonIcon fontSize="large" />
        </NavLink>

        {/* Companies */}
        <NavLink className={linkClasses} to="/companies" data-testid="companies-iconD">
          <ApartmentIcon fontSize="large" />
        </NavLink>

        {/* Documents / Job Applications */}
        <NavLink className={linkClasses} to="/job_applications" data-testid="applications-iconD">
          <DescriptionIcon fontSize="large" />
        </NavLink>

        {/* Drop Down Shortcut Menu */}
        <div className="flex flex-col items-center justify-center relative">
          <button className="flex items-center justify-items-center" onClick={toggleDropDown}>
            <AddCircleIcon
              fontSize="large"
              className="m-auto text-gray-500 justify-items-center mt-20"
            />
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
        {/* Account */}
        <NavLink
          to="/userInformation"
          className={({ isActive }) =>
            isActive
              ? "m-auto mb-10 rounded-full text-cyan-800 transform scale-150"
              : "m-auto mb-10 rounded-full text-gray-500 transform scale-100"
          }
          data-testid="update-user"
        >
          <AccountCircleIcon data-testid="updateUser-iconD" fontSize="large" />
        </NavLink>
        </div>


      </nav>

      {/* -- MOBILE HAMBURGER (shown on small screens only) -- */}
      <button
        className="flex items-center justify-items-center visible sm:hidden p-2"
        onClick={toggleSideMenu}
      >
        <MenuIcon data-testid="menu-iconM" fontSize="large" className="m-auto justify-items-center" />
      </button>

      {/* -- MOBILE SLIDE-OUT MENU (fixed) -- */}
      <nav
        className={
          "fixed top-0 left-0 z-10 bg-[#046576] w-64 h-screen transition-all duration-500 " +
          (sideMenuOpen ? "-translate-x-full" : "translate-x-0")
        }
      >
        <button className="min-sm:hidden m-4 text-white" onClick={toggleSideMenu}>
          <CloseIcon fontSize="large" data-testid="close-iconM" className="m-auto text-white" />
        </button>

        {/* Logo */}
        <Link className="block text-center my-4" to="/">
          <img className="mx-auto w-1/2" src={logo} alt="Logo" />
        </Link>

        {/* Home */}
        <NavLink className={linkClasses} to="/home" data-testid="home-iconM">
          <HomeIcon fontSize="large" />
          Home
        </NavLink>

        {/* Contacts */}
        <NavLink className={linkClasses} to="/contacts" data-testid="contacts-iconM">
          <PersonIcon fontSize="large" />
          Contacts
        </NavLink>

        {/* Companies */}
        <NavLink className={linkClasses} to="/companies" data-testid="companies-iconM">
          <ApartmentIcon fontSize="large" />
          Companies
        </NavLink>

        {/* Job Applications */}
        <NavLink className={linkClasses} to="/job_applications" data-testid="applications-iconM">
          <DescriptionIcon fontSize="large" />
          Job Applications
        </NavLink>

        {/* Add New (Mobile) */}
        <NavLink className={linkClasses} to="/add-new" data-testid="add-iconM">
          <PersonAddAlt1Icon fontSize="large" />
          Add New Contact
        </NavLink>

        {/* Account */}
        <NavLink
          to="/userInformation"
          className={({ isActive }) =>
            isActive
              ? "m-auto rounded-full text-cyan-500 transform scale-150"
              : "m-auto rounded-full text-white transform scale-100"
          }
          data-testid="update-userM"
        >
          <AccountCircleIcon data-testid="updateUser-iconM" fontSize="large" />
          User Information
        </NavLink>

        {/* Drop Down Shortcut Menu (Mobile) */}
        <div className="flex mt-auto flex-col items-center justify-center relative text-white">
          <button className="flex items-center justify-items-center m-4" onClick={toggleDropDown}>
            <AddCircleIcon data-testid="newmenu-iconM" fontSize="large" className="m-auto" />
            Create New...
          </button>
          <ul
            className={`bg-cyan-600 m-4 shadow-md rounded-md transition-all duration-700 ease-in-out transform ${
              isDropDownOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'
            }`}
          >
            <li className="p-2 hover:bg-gray-100 rounded text-center mb-2 font-[Helvetica Neue]">
              <Link data-testid="newContactLink" to="/contacts/new">Create New Contact</Link>
            </li>
            <li className="p-2 hover:bg-gray-100 rounded text-center mb-2 font-[Helvetica Neue]">
              <Link data-testid="newCompanyLink" to="/companies/new">Create New Company</Link>
            </li>
            <li className="p-2 hover:bg-gray-100 rounded text-center font-[Helvetica Neue]">
              <Link data-testid="newAppLink" to="/jobapplications/new">Create New Job Application</Link>
            </li>
          </ul>
        </div>

        {/* Update Profile (Mobile) - optional if you want a second link */}
        <Link
          to="/userInformation"
          className="m-auto mt-[10vh] text-[2.5vw] cursor-pointer text-white rounded-full text-center block"
          data-testid="update-userM"
        >
          <AccountCircleIcon fontSize="large" className="m-auto w-1/5 rounded-full bg-cyan-500 text-white" />
          Update Profile
        </Link>
      </nav>

      {/* -- QUAD COLOR BAR, now next to the nav in the flex layout -- */}
      <div className="quad-color-bar flex flex-col w-[1%] h-screen">
        <div className="bg-cyan-500 w-full h-1/4" />
        <div className="bg-yellow-500 w-full h-1/4" />
        <div className="bg-red-500 w-full h-1/4" />
        <div className="bg-green-500 w-full h-1/4" />
      </div>

      {/* -- MAIN CONTENT AREA -- */}
      <div className="flex-grow p-4 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default MenuBar;