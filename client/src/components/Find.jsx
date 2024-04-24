import React, { useEffect, useState } from 'react'
import { FaCoins } from "react-icons/fa";
import { MdCleaningServices, MdPersonSearch } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import AddCoin from './AddCoin'
import axios from 'axios'
import Swal from 'sweetalert2'
export default function Find(props) {
  const io = props.io
  const [coinCount, setCoinCount] = useState(0);
  const [showFilter, setShowFilter] = useState(0);
  const [showAddCoin, setShowAddCoin] = useState(0);
  const [sexFilter, setSexFilter] = useState('random');
  const [ageFilter, setAgeFilter] = useState(false);
  const [cityFilter, setCityFilter] = useState(false);
  const [user, setUser] = useState(undefined);
  const [me, setMe] = useState(undefined);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });


  useEffect(() => {
    (() => {
      setCoinCount(props.coin)
      setUser(props.connectedTo)
      setMe(props.user)
      if (props.user) {
        setSexFilter(props.user.config.sex)
        setAgeFilter(props.user.config.nearAge)
        setCityFilter(props.user.config.nearCity)
      }
    })();
    (async () => {
      const fetchedUser = await axios(import.meta.env.VITE_BASE_URL + '/api/user/' + location.pathname.split('/')[1]);
      setMe(fetchedUser.data)
      setSexFilter(fetchedUser.data.config.sex)
      setAgeFilter(fetchedUser.data.config.nearAge)
      setCityFilter(fetchedUser.data.config.nearCity)
    })();
  }, [props])
  const handleSearchButtonClick = () => {
    if (props.connectionStatus) {
      io.emit('search', location.pathname.split('/')[1])
    } else if (props.status == 'searching') {
      Toast.fire({
        icon: "info",
        title: "دارم برات میگردم یکم صبر داشته باش"
      });
    } else if (props.status == 'connecting') {
      Toast.fire({
        icon: "info",
        title: "یکم صبر کن تا اتصال برقرار شه"
      });
    }
  };
  const stopHandler = () => {
    io.emit('stop', location.pathname.split('/')[1])
  }



  const handleFilterButtonClick = () => {
    setShowFilter(1)
  };
  const hideFilterHandler = e => {
    setShowFilter(0)
  }
  const sexFilterHandler = e => {
    setSexFilter(e.target.dataset.sex)
    axios.put(`${import.meta.env.VITE_BASE_URL}/api/config/${location.pathname.split('/')[1]}`, { sex: e.target.dataset.sex })
  }
  const ageHandler = e => {
    setAgeFilter(e.target.checked)
    axios.put(`${import.meta.env.VITE_BASE_URL}/api/config/${location.pathname.split('/')[1]}`, { nearAge: e.target.checked })
  }
  const cityHandler = e => {
    setCityFilter(e.target.checked)
    axios.put(`${import.meta.env.VITE_BASE_URL}/api/config/${location.pathname.split('/')[1]}`, { nearCity: e.target.checked })

  }
  const showAddCoinHandler = e => {
   if( window.Telegram)window.Telegram.WebView.postEvent('web_app_expand')
    setShowAddCoin(1)
  }
  const hideAddCoinHandler = e => {
    setShowAddCoin(0)
  }
  return (
    <>
      {showAddCoin ? <AddCoin io={io} hideAddCoinHandler={hideAddCoinHandler} /> : ''}
      <div id='filterSection ' className={`${showFilter ? '' : 'hidden'} w-screen h-screen fixed bg-black z-10 bg-opacity-50`}>
        <div className='w-screen h-screen absolute top-0 z-0 ' onClick={hideFilterHandler}></div>
        <div className={` mx-auto w-max p-5 mt-40 text-center flex flex-col gap-4 bg-zinc-600 rounded-lg z-50 relative `}>
          <div className='flex [&>p]:px-3 [&>p]:py-2 [&>p]:bg-zinc-800 rounded-xl overflow-hidden [&>p]:flex-1'>
            <p onClick={sexFilterHandler} data-sex='male' style={{ backgroundColor: `${sexFilter == 'male' ? '#6af' : ''}` }}>پسر</p>
            <p onClick={sexFilterHandler} data-sex='random' style={{ backgroundColor: `${sexFilter == 'random' ? '#666' : ''}` }}>تصادفی</p>
            <p onClick={sexFilterHandler} data-sex='female' style={{ backgroundColor: `${sexFilter == 'female' ? '#f66' : ''}` }}>دختر</p>
          </div>
          <div className="inline-flex items-center" dir='rtl'>
            <label className="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="ageFilter"
              data-ripple-dark="true">
              <input id="ageFilter" type="checkbox"
                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10" onChange={ageHandler} checked={ageFilter} />
              <span
                className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                  stroke="currentColor" strokeWidth="1">
                  <path fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"></path>
                </svg>
              </span>
            </label>
            <label className="mt-px font-light text-zinc-300 cursor-pointer select-none" htmlFor="ageFilter">
              اتصال به هم سن و سال
            </label>
          </div>
          <div className="inline-flex items-center" dir='rtl'>
            <label className="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="nearRipple"
              data-ripple-dark="true">
              <input id="nearRipple" type="checkbox"
                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10" onChange={cityHandler} checked={cityFilter} />
              <span
                className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                  stroke="currentColor" strokeWidth="1">
                  <path fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"></path>
                </svg>
              </span>
            </label>
            <label className="mt-px font-light text-zinc-300 cursor-pointer select-none" htmlFor="nearRipple">
              اتصال به نزدیک ترین
            </label>
          </div>
        </div>
      </div>
      <div id='searchSection' className={`h-full ${props.status == 'find' ? 'hidden' : ''}`}>

        <div className="w-max  pt-4">

          <span className='flex text-3xl bg-blue-800  ml-5 px-3 py-2 rounded-xl relative  '><FaCoins className='text-yellow-300 mr-3' /> {coinCount}
            <div className='absolute -right-4 -top-3 bg-red-500 text-[1.25rem] p-1 rounded-full' onClick={showAddCoinHandler}><FaPlus /></div>
          </span>
        </div>

        {/* Search button in the middle of the page */}
        <button
          className={` mx-auto mt-14 bg-red-400 text-white h-40 w-40 rounded-full flex justify-center items-center text-6xl ${props.status == 'searching' ? 'animate-pulse' : ''}`}
          onClick={handleSearchButtonClick}
        >
          {props.connectionStatus && props.status != 'searching' ? <MdPersonSearch /> : !props.connectionStatus ? <p className='text-xl'>connecting...</p> : props.status == 'searching' ? <p className='text-xl'>searching...</p> : ''}
        </button>

        <button
          className="bg-blue-500 text-white py-3 text-مل px-4 rounded-xl  mx-auto mt-14 flex items-center gap-2"
          onClick={handleFilterButtonClick}
        >
          فیلتر
          <FaFilter />
        </button>

      </div>
      <div id='findSection' className={`h-full ${props.status != 'find' ? 'hidden' : ''} pt-5 text-center`}>
        <img src={user?.profileRef ? import.meta.env.VITE_BASE_URL + user?.profileRef : '/profile-place-holder.jpg'} className='max-w-52 mx-auto rounded-full aspect-square object-cover' alt="" />
        <h3 className={`text-center mt-5 text-2xl ${user?.sex == 'male' ? 'bg-blue-950' : 'bg-red-950'} w-max mx-auto px-3 py-1 rounded-md `}>{user?.nickName}</h3>
        <p className='mt-3'>سن : {user?.age}</p>
        <p>استان : {user?.state}</p>
        <p>شهر : {user?.city}</p>
        <button className='mt-3 bg-slate-700 px-3 py-2 rounded-lg' onClick={stopHandler}>قطع ارتباط</button>
      </div>
    </>
  )
}
