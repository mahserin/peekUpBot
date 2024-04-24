import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Profile() {
  const [sex, setSex] = useState(null)
  const [age, setAge] = useState(null)
  const [city, setCity] = useState(null)
  const [user, setUser] = useState(null)
  const [state, setState] = useState(null)
  const [states, setStates] = useState(null)
  const [cities, setCities] = useState(null)
  const [nickName, setNickName] = useState(null)
  const [showPicture, setShowPicture] = useState(0)
  useEffect(() => {
    axios(import.meta.env.VITE_BASE_URL + '/api/user/' + location.pathname.split('/')[1]).then(res => {
      setAge(res.data.age)
      setSex(res.data.sex)
      setUser(res.data)
      setCity(res.data.city)
      setState(res.data.state)
      setNickName(res.data.nickName)

    })
    axios('https://iran-locations-api.ir/api/v1/fa/states').then(res => setStates(res.data))


  }, [])
  useEffect(() => {
    if (state) axios(`https://iran-locations-api.ir/api/v1/fa/cities?state_id=${state.id}`).then(res => {
      setCities(res.data.cities)
    })

  }, [state])
  const stateHandler = e => {
    axios(`https://iran-locations-api.ir/api/v1/fa/cities?state_id=${e.target.value}`).then(res => setCities(res.data.cities))
    setState(states.find(stt => stt.id == +e.target.value))
    setCity(null)
    axios.put(`${import.meta.env.VITE_BASE_URL}/api/user/${location.pathname.split('/')[1]}`, { state: states.find(stt => stt.id == +e.target.value) }).then(res => { console.log(res) })
  }
  const cityHandler = e => {
    setCity(cities.find(ct => ct.id == +e.target.value))
    axios.put(`${import.meta.env.VITE_BASE_URL}/api/user/${location.pathname.split('/')[1]}`, { city: cities.find(ct => ct.id == +e.target.value) }).then(res => { console.log(res) })
  }
  const sexHandler = e => {
    if (sex == 'male') {
      setSex('female')
      axios.put(`${import.meta.env.VITE_BASE_URL}/api/user/${location.pathname.split('/')[1]}`, { sex: 'female' }).then(res => { console.log(res) })
    } else {
      setSex('male')
      axios.put(`${import.meta.env.VITE_BASE_URL}/api/user/${location.pathname.split('/')[1]}`, { sex: 'male' }).then(res => { console.log(res) })
    }

  }
  const nameHandler = e => {
    if (nickName) axios.put(`${import.meta.env.VITE_BASE_URL}/api/user/${location.pathname.split('/')[1]}`, { nickName }).then(res => console.log(res))
  }
  const ageHandler = e => {
    if (age) axios.put(`${import.meta.env.VITE_BASE_URL}/api/user/${location.pathname.split('/')[1]}`, { age }).then(res => console.log(res))
  }
  const showPictureHandler = e => {
    setShowPicture(1)
  }
  const setPictureHandler = e => {

    const formData = new FormData();
    formData.append("picture", e.target.files[0]);

    axios.post(`${import.meta.env.VITE_BASE_URL}/api/user/${location.pathname.split('/')[1]}/picture`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then(res => {
      setUser(res.data.user)
      setShowPicture(0)})
  }
  const hidePictureHandler = e => {
    setShowPicture(0)
  }
  const deletePictureHandler = e => {
    axios.delete(`${import.meta.env.VITE_BASE_URL}/api/user/${location.pathname.split('/')[1]}/picture`).then(res => {
      setUser(res.data.user)
      setShowPicture(0)

    })
  }
  return (
    <>
      <div id='imageSection ' className={`${showPicture ? '' : 'hidden'} w-screen h-screen fixed bg-black z-10 bg-opacity-50`}>
          <div className='w-screen h-screen absolute top-0 z-0 ' onClick={hidePictureHandler}></div>
        <div className=' mx-auto w-max p-5 mt-40 text-center flex flex-col gap-4 bg-zinc-600 rounded-lg z-50 relative'>
          <div className='relative '>
            <p>انتخاب عکس جدید</p>
            <input type="file" className='absolute top-0 bottom right-0 w-full h-full opacity-0' onChange={setPictureHandler} />
          </div>
          <hr className='w-full border-zinc-500 border-b-2' />
          <p onClick={deletePictureHandler}>حذف عکس فعلی</p>
        </div>
      </div>
      <div dir='rtl' className='pt-20 text-center' >
        <img onClick={showPictureHandler} src={ user?.profileRef ? import.meta.env.VITE_BASE_URL + user?.profileRef : '/profile-place-holder.jpg'} alt="" className='mx-auto h-32 w-32 object-cover rounded-full object-fit' />

        <input type="text" value={nickName} onBlur={nameHandler} placeholder='نام مستعار شما' className=' w-1/3 max-w-52 m-5 p-2 rounded-lg outline-none' onChange={e => setNickName(e.target.value)} />

        <input type="number" value={age} placeholder='سن شما' className=' w-1/3 max-w-52 m-5 p-2 rounded-lg outline-none' onBlur={ageHandler} onChange={e => { setAge(e.target.value); console.log(age) }} />
        <br className='' />
        <select className=' w-1/3 max-w-52 mx-5  my-3 p-2 rounded-lg outline-none' id="" onChange={stateHandler}>
          {state ? <option value={state.id}>{state.name}</option> : <option value={null}>استان خود را انتخاب کنید</option>}
          {states ? (states.map(stt => <option value={stt.id}>{stt.name}</option>)) : ''}
        </select>
        <select className=' w-1/3 max-w-52 mx-5 my-3 p-2 rounded-lg' name="" id="" onChange={cityHandler}>
          {city ? <option value={city.id}>{city.name}</option> : <option value={null}>شهر خود را انتخاب کنید</option>}
          {cities ? (cities.map(ct => <option value={ct.id}>{ct.name}</option>)) : ''}
        </select>
        <br />
        <div className="">
          <label className="switch w-[100px] h-[40px] relative inline-block bg-zinc-700 rounded-full border-2 border-zinc-500 " onClick={sexHandler}>
            <span className={`  absolute  top-1 bottom-1  px-3 rounded-full transition-all ${sex == 'male' ? 'translate-x-11 bg-blue-400' : sex == 'female' ? 'translate-x-3 bg-red-400' : ' translate-x-1/2 bg-zinc-500'} `}>{sex == 'male' ? 'پسر' : sex == 'female' ? 'دختر' : 'جنسیت'}</span>

          </label>
        </div>





      </div>
    </>
  )
}