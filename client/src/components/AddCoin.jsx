import React from 'react'
import { useEffect, useState } from 'react'
// import './App.css'
import randomId from './../utils/randomId'
import { Tooltip } from 'react-tooltip'
import { FaCopy } from "react-icons/fa";
import axios from 'axios'
export default function AddCoin(props) { 
  const [content, setContent] = useState()
  const io = props.io
  

  const copyHandler = e => {
    navigator.clipboard.writeText(document.getElementById('uid').innerText.trim());
  }
  const palHandler = async e => {
    e.preventDefault()
    e.target.innerText = 'چند لحظه صبر کنید ...'
    await axios.post(`${import.meta.env.VITE_BASE_URL}/api/pay/${location.pathname.split('/')[1]}`, { coin : e.target.dataset.coin , price : e.target.dataset.price , traceId : e.target.dataset.id })
    location.assign(e.target.href)

  }
  const changeContentHandler = async e => {
    const id = randomId()
    setContent(<>
    <div className='flex justify-center items-center w-full'>

      <div dir='rtl' className=''>

        <p className='flex justify-between text-xl'>شناسه پرداخت: <pre id='uid' onClick={copyHandler} className='my-anchor-element cursor-pointer bg-neutral-900 py-1 px-2 rounded-md flex items-center'>{id} <FaCopy className='text-neutral-600' /></pre></p>
        <Tooltip anchorSelect=".my-anchor-element" variant='light' className='bg-slate-50' place="top" openOnClick={true}>
          کپی شد
        </Tooltip>
        <p className='mt-9 text-justify max-w-72'>لطفا شناسه پرداخت بالا را کپی کرده و در حین عملیات پرداخت آن را ثبت نمایید</p>
        <a href={`https://zarinp.al/${e.target.dataset.ref}`} className='mt-5 block bg-indigo-500 text-white mx-10 py-2 rounded-md hover:text-zinc-200 hover:bg-indigo-900 transition-all' onClick={palHandler} data-coin={e.target.dataset.coin} data-id={id} data-price={e.target.dataset.price}>ورود به درگاه پرداخت</a>
      </div>

    </div>
    </>)
  }
  useEffect(() => {

    setContent(<>
          <h4>خرید سکه</h4>
      <div className=' flex flex-col gap-4 *:rounded-lg *:py-2 *:px-4 *:border *:border-transparent *:font-medium *:bg-[#1a1a1a] *:transition-all hover:*:border-[#646cff]' dir='rtl'>
        <button data-price='40000' data-coin='50' data-ref='584314' onClick={changeContentHandler}>50 سکه پیکاپ --- 40 هزار تومان</button>
        <button data-price='60000' data-coin='90' data-ref='584676' onClick={changeContentHandler}>90 سکه پیکاپ --- 60 هزار تومان</button>
        <button data-price='87000' data-coin='150' data-ref='584677' onClick={changeContentHandler}>150 سکه پیکاپ --- 87 هزار تومان</button>
        <button data-price='163000' data-coin='300' data-ref='584679' onClick={changeContentHandler}>300 سکه پیکاپ --- 163 هزار تومان</button>
        <button data-price='273000' data-coin='600' data-ref='584680' onClick={changeContentHandler}>600 سکه پیکاپ --- 273 هزار تومان</button>
        <button data-price='464000' data-coin='1200' data-ref='584683' onClick={changeContentHandler}>1200 سکه پیکاپ --- 464 هزار تومان</button>
        <button data-price='874000' data-coin='2400' data-ref='584684' onClick={changeContentHandler}>2400 سکه پیکاپ --- 874 هزار تومان</button>
      </div>
      <h4>دعوت از دوستان</h4>
      <div className='flex gap-10'>
        <button className='bg-emerald-400 p-1 px-2 text-zinc-700 font-bold rounded-lg' onClick={getInviteLinkHandler}>لینک دعوت</button>
        <p>با دعوت از دوستان 20 سکه بگیرید</p>
      </div>
      <div className='flex  justify-between'>
        <span>0</span>
        <p>:تعداد دعوتی ها</p>
      </div>
    </>)




  }, [])
  const getInviteLinkHandler = e => {
    io.emit('getInviteLink' , location.pathname.split('/').slice(-1)[0])
    window.Telegram.WebApp.close()
  }
  return (
    <>
        <div id='addCoinSection ' className={`w-screen h-screen fixed bg-black z-10 bg-opacity-50 ${props.className}`}>
        <div className='w-screen h-screen absolute top-0 z-0 ' onClick={props.hideAddCoinHandler}>

        </div>
        <div className={` mx-auto w-max  overflow-y-auto p-5 mt-20 text-center flex flex-col gap-4 bg-[#282730] rounded-lg z-50 relative  `}>

        {content}

        </div>
      </div>
    </>
  )
}


