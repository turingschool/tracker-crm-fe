import home from '../../components/icons/home_738822.png';
import logo from '../../turing-logo-gray.png';
import person from '../../components/icons/person-icon.png';
import building from '../../components/icons/building-1062.png';
import plus from '../../components/icons/plus-small_4338829.png';
import papers from '../../components/icons/documents-symbol_35920.png';

import { Link } from 'react-router-dom';
// import Contacts from '../contacts/Contacts';

function MenuBar() {

  return (

    // <div className='flex flex-col justify-items-center  bg-gray-500  justify-evenly h-screen mr-10 md:w-1/6 max-w-1/6'>
    <div className='flex flex-col justify-items-center border-r-[2px] justify-evenly h-screen mr-10 md:w-1/6'>
      <a className="m-auto  cursor-pointer" href="https://www.google.com/search?q=Turing.edu">
        <img className="m-auto w-1/2 cursor-pointer" src={logo}>
        </img>
      </a>
      <a className="m-auto  cursor-pointer" href="https://www.google.com/search?q=home">
        <img className="m-auto w-1/4 cursor-pointer" src={home}>
        </img>
      </a>
    {/* Contacts */}
      <Link className="m-auto  cursor-pointer" to="/contacts">
        <img className="m-auto w-1/4 cursor-pointer" src={person}/>
      </Link>

      <a className="m-auto  cursor-pointer" href="https://www.google.com/search?q=building">

        <img className="m-auto w-1/4 cursor-pointer" src={building}>
        </img>
      </a>
      <a className="m-auto  cursor-pointer" href="https://www.google.com/search?q=papers">

      <img className="m-auto w-1/4 cursor-pointer" src={papers}>
      </img>
      </a>

      <a className="m-auto  cursor-pointer" href="https://www.google.com/search?q=plus">

        <img className="m-auto w-1/4 cursor-pointer" src={plus}>
        </img>
      </a>
      <a className="m-auto  cursor-pointer" href="https://www.google.com/search?q=account">

        <img className="m-auto w-1/5  rounded-full bg-blue-200 cursor-pointer" src={person}>
        </img>
      </a>
      <div className='m-auto h-auto '>
      </div>

    </div>
  );
}

export default MenuBar;