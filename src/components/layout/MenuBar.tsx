import logo from '../../turing-logo-gray.png';
import { useParams, Link } from 'react-router-dom';

// MUI Icons
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

function MenuBar() {
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
      <Link className="m-auto cursor-pointer" to="/profile">
        <PersonIcon fontSize="large" className="m-auto text-white" />
      </Link>

      {/* Companies */}
      <Link className="m-auto cursor-pointer" to="/companies">
        <ApartmentIcon fontSize="large" className="m-auto text-white" />
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

      <div className="m-auto h-auto"></div>  
    </div>
  );
}

export default MenuBar;