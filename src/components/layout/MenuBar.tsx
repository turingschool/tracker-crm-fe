import logo from "../../turing-logo-gray.png";
import { useParams, NavLink, Link, Outlet } from "react-router-dom";
import { useState } from "react";
import { useUserLoggedContext } from "../../context/UserLoggedContext";

// MUI Icons
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import ApartmentIcon from "@mui/icons-material/Apartment";
import DescriptionIcon from "@mui/icons-material/Description";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

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
      ? "m-auto text-cyan-800 mt-[5vh] transform scale-125 transition-transform duration-150"
      : "m-auto text-gray-500 mt-[5vh] transform scale-100 transition-transform duration-150";
  const mobileClasses = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "ml-[5vw] mt-3 text-cyan-300  "
      : "ml-[5vw] mt-3 text-white transform scale-100 ";


  return (
    <div className='flex h-screen'>
      {/* // Menu */}
      <nav className='hidden sm:flex flex-col justify-items-center justify-evenly h-screen ml-5 mr-4 w-28'>
        {/* Desktop Menu
        < nav className='flex flex-col fixed max-sm:hidden  justify-items-center h-screen sm:w-1/12 ' > */}
          {/* Logo */}
          <Link className="m-auto cursor-pointer mt-[2vh]" data-testid="logo" to="/">
            <img aria-label="logo" className="m-auto cursor-pointer" src={logo} />
          </Link>
          {/* Home */}
          <NavLink className={linkClasses} to="/home" data-testid="home-iconD">
            <HomeIcon aria-label="Home" fontSize="large" />
            <span hidden>&emsp; Home</span>
          </NavLink>
          {/* Contacts */}
          <NavLink className={linkClasses} to="/contacts" data-testid="contacts-iconD">
            <PersonIcon aria-label="Contacts" fontSize="large" />
            <span hidden>&emsp; Contacts</span>
          </NavLink>
          {/* Companies */}
          <NavLink className={linkClasses} to="/companies" data-testid="companies-iconD">
            <ApartmentIcon aria-label="Companies" fontSize="large" />
            <span hidden>&emsp; Companies</span>
          </NavLink>
          {/* Documents / Job Applications */}
          <NavLink className={linkClasses} to="/job_applications" data-testid="applications-iconD">
            <DescriptionIcon aria-label="Job Applications" fontSize="large" />
            <span hidden>&emsp; Job Applications</span>
          </NavLink>
          {/* Drop Down Shortcut Menu */}
          <div className="flex flex-col items-center justify-center relative">
            <button className={`flex items-center justify-items-center aria-haspopup="true"
            ${isDropDownOpen ? "text-cyan-800" : "text-gray-500"}`} data-testid="newmenu-iconD" onClick={toggleDropDown}>
              <AddCircleIcon aria-label="Add New" fontSize="large" className="m-auto justify-items-center mt-[6vh]" />
              <span hidden>Add New...</span>
            </button>
            <ul className={`absolute top-full left-0 bg-cyan-800 shadow-md rounded-md transition-all text-white duration-700 ease-in-out
            ${isDropDownOpen ? 'scale-100 opacity-100 visible' : 'hidden'}`} style={{ zIndex: 10 }}>
              <li className="p-2 hover:bg-gray-100 rounded text-center mb-2">
                <Link to="/contacts/new" onClick={toggleDropDown}>Add New Contact</Link>
                <span hidden>Add New Contact</span>
              </li>
              <li className="p-2 hover:bg-gray-100 rounded text-center mb-2">
                <Link to="/companies/new" onClick={toggleDropDown}>Add New Company</Link>
                <span hidden>Add New Company</span>
              </li>
              <li className="p-2 hover:bg-gray-100 rounded text-center">
                <Link to="/jobapplications/new" onClick={toggleDropDown}>Add New Job Application</Link>
                <span hidden>Add New Job Application</span>
              </li>
            </ul>
          </div>
          {/* Account */}
          <NavLink
            to="/userInformation"
            className={({ isActive }) =>
              isActive
                ? "m-auto mt-[15vh] rounded-full bg-blue-300 text-cyan-800 transform scale-150 transition-transform duration-150"
                : "m-auto mt-[15vh] rounded-full bg-blue-300 text-gray-500 transform scale-100 transition-transform duration-150"
            } data-testid="update-user">
            <AccountCircleIcon aria-label="User Information" data-testid="updateUser-iconD" fontSize="large" />
            <span hidden>Update User</span>
          </NavLink>
        </nav>

        {/* -- MOBILE HAMBURGER, shown on small screens only -- */}
      <button aria-hidden="false" className="flex items-center justify-items-center visible sm:hidden p-2" onClick={toggleSideMenu}>
          <MenuIcon data-testid="menu-iconM" fontSize="large" className="m-auto justify-items-center" />
          <span hidden>SideBar</span>
      </button>
        {/* -- MOBILE SLIDE-OUT MENU, shown on small screens only -- */}

        <nav data-testid="slideout-menu" className={"fixed flex flex-col top-0 left-0 z-10 bg-[#046576] w-64  h-screen transition-all duration-500 " + 
          (sideMenuOpen ? "-translate-x-full" : " translate-x-0")}>
          <button aria-hidden="false" className="min-sm:hidden m-4 text-white" onClick={toggleSideMenu}>
            <CloseIcon fontSize="large" data-testid="close-iconM" className="m-auto text-white justify-items-center" />
            <span aria-hidden="true" hidden>&emsp; Close Sidebar</span>
          </button>
          {/* Logo */}
          <Link aria-hidden="false" className="block text-center my-4 cursor-pointer" to="/">
            <img className="mx-auto w-1/2 cursor-pointerM" src={logo} alt="Logo" />
          </Link>
          {/* Home */}
          <NavLink aria-hidden="false" className={mobileClasses} data-testid="home-iconM" to="/home" onClick={toggleSideMenu}>
            <HomeIcon fontSize="large" />
            <span aria-hidden="true" aria-label="Home">&emsp; Home</span>
          </NavLink>
          {/* Contacts */}
          <NavLink aria-hidden="false" className={mobileClasses} to="/contacts" data-testid="contacts-iconM" onClick={toggleSideMenu}>
            <PersonIcon fontSize="large" />
            <span aria-hidden="true" aria-label="Contacts">&emsp; Contacts</span>
          </NavLink>
          {/* Companies */}
          <NavLink aria-hidden="false" className={mobileClasses} to="/companies" data-testid="companies-iconM" onClick={toggleSideMenu}>
            <ApartmentIcon fontSize="large" />
            <span aria-hidden="true" aria-label="Companies">&emsp; Companies</span>
          </NavLink>
          {/* Job Applications */}
          <NavLink aria-hidden="false" className={mobileClasses} to="/job_applications" onClick={toggleSideMenu}>
            <DescriptionIcon data-testid="applications-iconM" fontSize="large" />
            <span aria-hidden="true" aria-label="Job Applications">&emsp; Job Applications</span>
          </NavLink>
          {/* Drop Down Shortcut Menu */}
          <div aria-hidden="false" className="flex ml-[5vw] mt-4 flex-col items-start justify-start relative">
            <button aria-label="Add New" aria-haspopup="true" className="flex items-center justify-items-center text-white" onClick={toggleDropDown}>
              <AddCircleIcon aria-label="Add New" data-testid="newmenu-iconM" fontSize="large" className="m-auto text-white justify-items-center" />
              <span aria-hidden="true"> &emsp; Add New...</span>
            </button>
            <ul className={`bg-cyan-500 m-4 shadow-md rounded-md transition-all duration-700 ease-in-out transform
            ${isDropDownOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}>
              <li className="p-2 hover:bg-gray-100 rounded text-center mb-2 hover:text-black" onClick={() => { toggleSideMenu(); toggleDropDown(); }}>
                <Link data-testid="newContactLink" to="/contacts/new">
                  <span aria-hidden="true" aria-label="Add New Contact">Add New Contact</span>
                </Link>
              </li>
              <li className="p-2 hover:bg-gray-100 rounded text-center mb-2 hover:text-black" onClick={() => { toggleSideMenu(); toggleDropDown(); }}>
                <Link data-testid="newCompanyLink" to="/companies/new"><span aria-hidden="false" aria-label="Add New Company">Add New Company</span></Link>
              </li>
              <li className="p-2 hover:bg-gray-100 rounded text-center hover:text-black" onClick={() => { toggleSideMenu(); toggleDropDown(); }}>
                <Link data-testid="newAppLink" to="/jobapplications/new"> <span aria-hidden="false" aria-label="Add New Job Application">Add New Job Application</span></Link>
              </li>
            </ul>
          </div>
          {/* Account */}
          <NavLink aria-hidden="false" to="/userInformation"
            className="m-auto ml-[5vw] cursor-pointer text-white rounded-full"
            data-testid="update-userM" onClick={toggleSideMenu}>
            <AccountCircleIcon data-testid="updateUser-iconM" fontSize="large" className="m-auto rounded-full bg-cyan-500 text-white" />
            <span aria-hidden="true" aria-label="Update User Profile">&emsp;Update Profile</span>
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