import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Swal from 'sweetalert2'

import Find from './../components/Find'
import Profile from './../components/Profile'
import History from './../components/History'


import io from '../socket'

const MobileWebPage = () => {
  const [activeTab, setActiveTab] = useState('main');
  const [status, setStatus] = useState('disconnect');
  const [connectionStatus, setConnectionStatus] = useState(false); // متغیر جدید برای وضعیت اتصال
  const [connectedTo, setConnectedTo] = useState(undefined);
  const [coin, setCoin] = useState(0);
  const [user, setUser] = useState(null);

  const handleTabChange = async (tab) => {
    await setActiveTab(tab);
  };

  useEffect(() => {
    (async () => {
      try {
        const connection = await axios(import.meta.env.VITE_BASE_URL + '/api/status/' + location.pathname.split('/')[1]);
        if (connection.data?.message == 'find') {
           setConnectedTo(connection.data.connectedTo);
           setStatus('find');
        }
        if(connection.data?.message == 'search') {
           setStatus('searching');
        }

        const users = await axios(import.meta.env.VITE_BASE_URL + '/api/user/' + location.pathname.split('/')[1]);
        setCoin(users.data.coin)
        setUser(users.data)
        if (users.data.firstTime) {
          setActiveTab('profile');
          Swal.fire({
            title: "خوش آمدید",
            text: "از این بخش اطلاعات ضروری خود را وارد کنید و بعد در بخش اصلی شروع به جستجو افراد کنید",
            icon: "info"
          });
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    io.on('connect', () => {
      setConnectionStatus(true);
    });

    io.on('disconnect', () => {
      setConnectionStatus(false);
    });

    io.on('searching', () => setStatus('searching'));
    io.on('closed', () => {
      setStatus('connect');
      setConnectedTo(undefined);
    });
    io.on('find', (arg) => {
      setConnectedTo(arg);
      setStatus('find');
    });
    io.on('coin', (arg) => {
      setCoin(arg);
    });
    io.on('coin:scant', (arg) => {
      Swal.fire({
        title: "سکه ناکافی",
        text: "سکه های شما برای این فیلتر کافی نیست لطفا فیلتر خود را عوض کنید و یا سکه تهیه کنید",
        icon: "error"
      });
    });
    io.on('notfound', (arg) => {
      setStatus('connect');
      Swal.fire({
        title: "کسی نیست ☹️",
        text: "کسی با فیلتر مد نظر شما یافت نشد لطفا فیلتر خود را عوض کنبد",
        icon: "error"
      });
    });

    return () => {
      io.off('connect');
      io.off('disconnect');
      io.off('searching');
      io.off('closed');
      io.off('find');
      io.off('coin');
      io.off('coin:scant');
    };
  }, []);

  return (
    <div className=" min-h-screen flex flex-col overflow-hidden">
      <div className="bg-zinc-800">

        <div className='relative' style={{ height: '27rem' }}>

          {activeTab == 'main' ? <Find io={io} connectionStatus={connectionStatus} status={status} user={user} coin={coin} connectedTo={connectedTo} /> : activeTab == 'profile' ? <Profile /> : <History />}
        </div>
        {/* Tabs at the bottom of the page */}
        <div className="  flex justify-between">
          <div className={`w-full h-full ${activeTab != 'main' ? 'bg-zinc-800' : 'bg-zinc-900'}`}>
            <button
              className={`text-white w-full h-full py-5 ${activeTab === 'main' ? 'bg-zinc-800 rounded-br-2xl' : activeTab == 'profile' ? 'bg-zinc-900 rounded-tr-2xl' : 'bg-zinc-900'}`}
              onClick={() => handleTabChange('main')}
            >
              Main
            </button>
          </div>
          <div className={`w-full h-full ${activeTab != 'profile' ? 'bg-zinc-800' : 'bg-zinc-900'}`}>

            <button
              className={`text-white w-full h-full py-5 ${activeTab === 'profile' ? 'bg-zinc-800 rounded-b-2xl' : activeTab === 'main' ? 'bg-zinc-900 rounded-tl-2xl' : 'bg-zinc-900 rounded-tr-2xl'}`}
              onClick={() => handleTabChange('profile')}
            >
              Profile
            </button>
          </div>
          <div className={`w-full h-full ${activeTab != 'history' ? 'bg-zinc-800' : 'bg-zinc-900'}`}>
            <button
              className={`text-white w-full h-full py-5 ${activeTab === 'history' ? 'bg-zinc-800 rounded-bl-2xl' : activeTab === 'profile' ? 'bg-zinc-900 rounded-tl-2xl' : 'bg-zinc-900'}`}
              onClick={() => handleTabChange('history')}
            >
              History
            </button>
          </div>
        </div>
      </div>
      <div className="bg-zinc-900 h-16">

      </div>
    </div>
  );
};

export default MobileWebPage;
