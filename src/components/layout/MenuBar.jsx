import './MenuBar.css';
// import SearchTitle from '../SearchTitle/SearchTitle.js';
// import FilterByRating from '../FilterByRating/FilterByRating.js';
// import {ReactComponent as Logo} from '../../assets/orange-carrot-2.svg'

function MenuBar() {
  return (
    <header>
      <div className='logo-container'>
        {/* <Logo className='carrot-logo' /> */}
        {/* <img className='carrot-logo' src='/orange-carrot-2.svg' alt="crusty carrots logo" /> */}
        <h1 className="full-site-title">
          <div className="site-title">Crusty</div>
          <div className="site-title">Carrots</div>
        </h1>
      </div>
      <div className="search-all">
        {/* <FilterByRating
          setFilteredMovies={setFilteredMovies}
          moviesList={moviesList}
          filteredMovies={filteredMovies}
        />
        <SearchTitle
          setFilteredMovies={setFilteredMovies}
          moviesList={moviesList}
          filteredMovies={filteredMovies}
        /> */}
      </div>
    </header >
  );
}

export default MenuBar;