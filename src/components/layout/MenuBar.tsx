import home from '../../components/icons/home_738822.png';
import logo from '../../turing-logo-gray.png';
import person from '../../components/icons/person-icon.png';
import companies from '../../components/icons/building-1062.png';
import plus from '../../components/icons/plus-small_4338829.png';
import papers from '../../components/icons/documents-symbol_35920.png';
import { useParams, Link } from 'react-router-dom';


function MenuBar() {
  const { userID } = useParams()
  console.log(userID)

  return (
    <div className='flex flex-col justify-items-center  bg-gray-500  justify-evenly h-screen mr-10 md:w-1/6 max-w-1/6'>
      {/* Logo */}
      <Link className="m-auto cursor-pointer" to="/">
        <img className="m-auto w-1/2 cursor-pointer" src={logo} alt="Logo" />
      </Link>

      {/* Home */}
      <Link className="m-auto cursor-pointer" to="/home">
        <img className="m-auto w-1/4 cursor-pointer" src={home} alt="Home" />
      </Link>

      {/* Profile */}
      <Link className="m-auto cursor-pointer" to="/profile">
        <img className="m-auto w-1/4 cursor-pointer" src={person} alt="Profile" />
      </Link>

      {/* Companies */}
      <Link className="m-auto cursor-pointer" to="/companies">
        <img className="m-auto w-1/4 cursor-pointer" src={companies} alt="Companies" />
      </Link>

      {/* Documents */}
      <Link className="m-auto cursor-pointer" to="/documents">
        <img className="m-auto w-1/4 cursor-pointer" src={papers} alt="Documents" />
      </Link>

      {/* Add New */}
      <Link className="m-auto cursor-pointer" to="/add-new">
        <img className="m-auto w-1/4 cursor-pointer" src={plus} alt="Add New" />
      </Link>

      {/* Account */}
      <Link className="m-auto cursor-pointer" to="/account">
        <img className="m-auto w-1/5 rounded-full bg-blue-200 cursor-pointer" src={person} alt="Account" />
      </Link>

      <div className="m-auto h-auto"></div>  
    </div>
  );
}

export default MenuBar;