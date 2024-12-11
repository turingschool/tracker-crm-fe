import home from '../../components/icons/home_738822.png';
import logo from '../../turing-logo-gray.png';
import person from '../../components/icons/person-icon.png';
import building from '../../components/icons/building-1062.png';
import plus from '../../components/icons/plus-small_4338829.png';
import papers from '../../components/icons/documents-symbol_35920.png';


function MenuBar() {

  return (

    <div className='flex-col flex  border-r-8 border-gray-300  bg-white  h-screen mr-10 md:w-[7vw] max-w-[20vw]'>
      
      <a className=" m-auto w-[5vw]  cursor-pointer" href="https://www.google.com/search?q=Turing.edu">
      
        <img className="  cursor-pointer" src={logo}>
        </img>
      </a>
      <a className="m-auto w-[3vw] cursor-pointer" href="https://www.google.com/search?q=home">
      
        <img className="m-auto  cursor-pointer" src={home}>
        </img>
      </a>

      <a className="m-auto w-[3vw] cursor-pointer" href="https://www.google.com/search?q=person">
        <img className="m-auto cursor-pointer" src={person}>
        </img>
      </a>

      <a className="m-auto w-[3vw] cursor-pointer" href="https://www.google.com/search?q=building">

        <img className="m-auto cursor-pointer" src={building}>
        </img>
      </a>
      <a className="m-auto w-[3vw] cursor-pointer" href="https://www.google.com/search?q=papers">

      <img className="m-auto  cursor-pointer" src={papers}>
      </img>
      </a>

      <a className="m-auto w-[3vw] cursor-pointer" href="https://www.google.com/search?q=plus">

        <img className="m-auto  cursor-pointer" src={plus}>
        </img>
      </a>
      <a className="m-auto w-[2.5vw] cursor-pointer" href="https://www.google.com/search?q=account">

        <img className="m-auto rounded-full bg-blue-200 cursor-pointer" src={person}>
        </img>
      </a>
      <div className='mt-[25vh] h-auto '>
      </div>

    </div>
  );
}

export default MenuBar;