'use client';

import React from 'react';

const Sidebar = () => {
  // FIXME: 一旦仮置き
  const rooms = ['ルーム 1', 'ルーム 2', 'ルーム 3'];

  return (
    <div className='bg-custom-blue h-full overflow-y-auto px-5 flex flex-col'>
      <div className='flex-grow'>
        <div className='cursor-pointer flex justify-evenly items-center border mt-2 rounded-md hover:bg-blue-800 duration-150'>
          <span className='text-white p-4 text-lg'>＋</span>
          <h1 className='text-white text-xl font-semibold p-4'>新しいチャット</h1>
        </div>
        <ul className='text-white-400 mt-4'>
          {rooms.map((room, index) => (
            <li key={index} className='cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-700 duration-150 '>
              {room}
            </li>
          ))}
        </ul>
      </div>

      <div className='text-lg flex items-center justify-evenly mb-2 cursor-pointer p-4 text-slate-100 hover:bg-slate-700 duration-150'>
        <span>ログアウト</span>
      </div>
    </div>
  );
};

export default Sidebar;
