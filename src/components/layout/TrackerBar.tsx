function TrackerBar() {

	return (
		<>
			<div className='quad-color-bar flex flex-col w-[1%] h-[100%]'>
				<div className='cyan-bar bg-cyan-500 w-[100%] h-[25%]'/>
				<div className='yellow-bar bg-yellow-500 w-[100%] h-[25%]'/>
				<div className='red-bar bg-red-500 w-[100%] h-[25%]'/>
				<div className='green-bar bg-green-500 w-[100%] h-[25%]'/>
			</div>
			<div className='title-wrap w-6/12 flex flex-col justify-center items-center bg-[#046576]'>
				<div className='app-name-and-author flex justify-center'>
					<h1 className='app-name font-sans font-[Helvetica Neue] text-2xl md:text-7xl  font-semibold tracking-wide text-slate-100'>Tracker</h1>
					<h2 className='app-author font-sans font-[Helvetica Neue] md:text-2xl font-bold leading-9 tracking-wide text-[#34a6bb]'><br />&nbsp; by Turing</h2>
				</div>
				<h3 className='app-tagline flex justify-center font-sans font-[Helvetica Neue] text-3xl font-extralight tracking-widest ml-5 text-slate-100'>Job hunting made easier.</h3>
			</div>
		</>
	)
}

export default TrackerBar;