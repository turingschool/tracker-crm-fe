import logo from '../../turing-logo-gray.png';
import { useParams, NavLink, Link, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useUserLoggedContext } from '../../context/UserLoggedContext'; 

// MUI Icons
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';
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

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "m-auto text-cyan-800 mt-[5vh] transform scale-150 transition-transform duration-150"
      : "m-auto text-gray-500 mt-[5vh] transform scale-125 transition-transform duration-150";

  return (
    <div className="flex h-screen">
      {/* -- DESKTOP NAV, hidden on small screens -- */}
      <nav className="hidden sm:flex flex-col justify-items-center justify-evenly h-screen ml-5 mr-4 w-28">
        {/* Logo */}
        <Link className="m-auto cursor-pointer mt-[2vh]" to="/">
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
          <button className={`flex items-center justify-items-center 
            ${isDropDownOpen ? "text-cyan-800" : "text-gray-500"}`} onClick={toggleDropDown}>
            <AddCircleIcon fontSize="large" className="m-auto justify-items-center mt-[6vh]"/>
          </button>
          <ul className={`absolute top-full left-0 bg-cyan-600 shadow-md rounded-md transition-all duration-700 ease-in-out
            ${isDropDownOpen ? 'scale-100 opacity-100 visible' : 'hidden'}`} style={{ zIndex: 10 }}>
            <li className="p-2 hover:bg-gray-100 rounded text-center mb-2">
              <Link to="/contacts/new" onClick={toggleDropDown}>Add New Contact</Link>
            </li>
            <li className="p-2 hover:bg-gray-100 rounded text-center mb-2">
              <Link to="/companies/new" onClick={toggleDropDown}>Add New Company</Link>
            </li>
            <li className="p-2 hover:bg-gray-100 rounded text-center">
              <Link to="/jobapplications/new" onClick={toggleDropDown}>Add New Job Application</Link>
            </li>
          </ul>
        </div>

        {/* Account */}
        <NavLink to="/userInformation"
          className={({ isActive }) =>
            isActive
              ? "m-auto mt-[20vh] rounded-full text-cyan-800 transform scale-150 transition-transform duration-150"
              : "m-auto mt-[20vh] rounded-full text-gray-500 transform scale-125 transition-transform duration-150"
          }
          data-testid="update-user">
          <AccountCircleIcon data-testid="updateUser-iconD" fontSize="large" />
        </NavLink>
      </nav>

      {/* -- MOBILE HAMBURGER, shown on small screens only -- */}
      <button className="flex items-center justify-items-center visible sm:hidden p-2" onClick={toggleSideMenu}>
        <MenuIcon data-testid="menu-iconM" fontSize="large" className="m-auto justify-items-center" />
      </button>

      {/* -- MOBILE SLIDE-OUT MENU, shown on small screens only -- */}
      <nav className={"fixed flex flex-col top-0 left-0 z-10 bg-[#046576] w-64 h-screen transition-all duration-500 " +
        (sideMenuOpen ? "-translate-x-full" : "translate-x-0")}>

        <button className="min-sm:hidden m-4 text-white" onClick={toggleSideMenu}>
          <CloseIcon fontSize="large" data-testid="close-iconM" className="m-auto text-white" />
        </button>

        {/* Logo */}
        <Link className="block text-center my-4" to="/" onClick={toggleSideMenu}>
          <img className="mx-auto w-1/2" src={logo} alt="Logo" />
        </Link>
        {/* Home */}
        <NavLink className="m-auto text-white" to="/home" data-testid="home-iconM" onClick={toggleSideMenu}>
          <HomeIcon fontSize="large"/>
        </NavLink>
        {/* Contacts */}
        <NavLink className="m-auto text-white" to="/contacts" data-testid="contacts-iconM" onClick={toggleSideMenu}>
          <PersonIcon fontSize="large"/>
        </NavLink>
        {/* Companies */}
        <NavLink className="m-auto text-white" to="/companies" data-testid="companies-iconM" onClick={toggleSideMenu}>
          <ApartmentIcon fontSize="large"/>
        </NavLink>
        {/* Job Applications */}
        <NavLink className="m-auto text-white" to="/job_applications" data-testid="applications-iconM" onClick={toggleSideMenu}>
          <DescriptionIcon fontSize="large"/>
        </NavLink>

        {/* Drop Down Shortcut Menu (Mobile) */}
        <div className="flex mt-auto flex-col items-center justify-center relative text-white">
          <button className="flex items-center justify-items-center m-4" onClick={toggleDropDown}>
            <AddCircleIcon data-testid="newmenu-iconM" fontSize="large" className="m-auto" />
          </button>
          <ul className={`bg-cyan-500 m-4 shadow-md rounded-md transition-all duration-700 ease-in-out transform
            ${isDropDownOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}>
            <li className="p-2 hover:bg-gray-100 rounded text-center mb-2 hover:text-black" onClick={() => {toggleSideMenu(); toggleDropDown();}}>
              <Link data-testid="newContactLink" to="/contacts/new">Add New Contact</Link>
            </li>
            <li className="p-2 hover:bg-gray-100 rounded text-center mb-2 hover:text-black" onClick={() => {toggleSideMenu(); toggleDropDown();}}>
              <Link data-testid="newCompanyLink" to="/companies/new">Add New Company</Link>
            </li>
            <li className="p-2 hover:bg-gray-100 rounded text-center hover:text-black" onClick={() => {toggleSideMenu(); toggleDropDown();}}>
              <Link data-testid="newAppLink" to="/jobapplications/new">Add New Job Application</Link>
            </li>
          </ul>
        </div>

        {/* Account */}
        <NavLink to="/userInformation" className="m-auto text-white mb-14" data-testid="update-userM">
          <AccountCircleIcon data-testid="updateUser-iconM" fontSize="large" />
        </NavLink>
      </nav>

      {/* -- QUAD COLOR BAR -- */}
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