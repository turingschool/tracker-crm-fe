import home from '../../components/icons/home_738822.png';
import logo from '../../turing-logo-gray.png';
import person from '../../components/icons/person-icon.png';
import building from '../../components/icons/building-1062.png';
import plus from '../../components/icons/plus-small_4338829.png';
import papers from '../../components/icons/documents-symbol_35920.png';

function MenuBar() {
  return (
    <div className='flex flex-col justify-items-center  bg-gray-500  justify-evenly h-screen mr-10 md:w-1/6 max-w-1/6'>

      <img className="m-auto w-1/2 cursor-pointer" src={logo}
      // onClick={}
      >
      </img>

      <img className="m-auto w-1/4 cursor-pointer" src={home}
      // onClick={}
      >

      </img>
      <img className="m-auto w-1/4 cursor-pointer" src={person}
      // onClick={}
      >
      </img>
      <img className="m-auto w-1/4 cursor-pointer" src={building}
      // onClick={}
      >
      </img>
      <img className="m-auto w-1/4 cursor-pointer" src={papers}
      // onClick={}
      >
      </img>
      <img className="m-auto w-1/4 cursor-pointer" src={plus}
      // onClick={}
      >
      </img>

      <img className="m-auto w-1/5  rounded-full bg-blue-200 cursor-pointer" src={person}
      // onClick={}
      >
      </img>
      <div className='m-auto h-auto '>
      </div>

    </div>
  );
}

export default MenuBar;