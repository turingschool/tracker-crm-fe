import './MenuBar.css';
import * as home from '../../components/icons/home_738822.png'
import * as turing from '../../components/icons/turing-logo-gray.png'
import * as person from '../../components/icons/person-icon.png'
import * as building from '../../components/icons/building-1062.png'
import * as plus from '../../components/icons/plus-small_4338829.png'
import * as papers from '../../components/icons/documents-symbol_35920.png'
function MenuBar() {
  return (
    <header>
      <div className='logo-container'>
        <img className="icon" src={turing} />
        <img className="small-icon" src={home} />
        <img className="small-icon" src={person} />
        <img className="small-icon" src={building} />
        <img className="small-icon" src={papers} />
        <img className="small-icon" src={plus} />
        <div className='account-icon-container'>
          <p>test</p>
          <img className="account-icon" src={person} />
        </div>
      </div>
    </header >
  );
}

export default MenuBar;