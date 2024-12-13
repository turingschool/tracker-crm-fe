// import home from '../../components/icons/home_738822.png';
import logo from '../../turing-logo-gray.png';
// import person from '../../components/icons/person-icon.png';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
// import building from '../../components/icons/building-1062.png';
import ApartmentIcon from '@mui/icons-material/Apartment';
// import plus from '../../components/icons/plus-small_4338829.png';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
// import papers from '../../components/icons/documents-symbol_35920.png';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeIcon from '@mui/icons-material/Home';

function MenuBar() {
  console.log(HomeIcon);
  return (

    <div className='flex-col flex  border-r-8 border-gray-300  bg-white  h-screen mr-10 md:w-[7.5vw] max-w-[20vw]'>
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
      <div className='mt-[25vh] h-auto '>
      </div>
    </div>
  );
}

export default MenuBar;