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
    <div className='flex bg-white  h-screen mr-10 md:w-[10vw] max-w-[20vw]'>
      <div className='flex flex-col h-screen w-[94%]'>
        <a className=" m-auto w-[5vw]  cursor-pointer" href="https://www.google.com/search?q=Turing.edu">
          <img className="  cursor-pointer" src={logo}>
          </img>
        </a>
        <a className="m-auto  text-[3vw] cursor-pointer " href="https://www.google.com/search?q=home">
          <HomeIcon fontSize='inherit' />
        </a>
        <a className="m-auto text-[3vw] cursor-pointer" href="https://www.google.com/search?q=person">
          <PersonIcon fontSize='inherit' />
        </a>
        <a className="m-auto text-[3vw] cursor-pointer" href="https://www.google.com/search?q=building">
          <ApartmentIcon fontSize='inherit' />
        </a>
        <a className="m-auto text-[3vw] cursor-pointer" href="https://www.google.com/search?q=papers">
          <DescriptionIcon fontSize='inherit' />
        </a>
        <a className="m-auto text-[3vw] cursor-pointer" href="https://www.google.com/search?q=plus">
          <PersonAddAlt1Icon fontSize='inherit' />
        </a>
        <a className="m-auto mt-[10vh] text-[2.5vw] cursor-pointer rounded-full bg-cyan-200" href="https://www.google.com/search?q=account">
          <PersonOutlineOutlinedIcon fontSize='inherit' />
        </a>
      </div>
      <div className='quad-color-bar flex flex-col w-[6%] h-[100%]'>
        <div className='cyan-bar bg-cyan-500 w-[100%] h-[25%]'/>
        <div className='yellow-bar bg-yellow-500 w-[100%] h-[25%]'/>
        <div className='red-bar bg-red-500 w-[100%] h-[25%]'/>
        <div className='green-bar bg-green-500 w-[100%] h-[25%]'/>
      </div>
    </div>
  );
}

export default MenuBar;