'use client';

import React from 'react';

const Chat = () => {
  return (
    <div className='bg-blackblue secondary h-full p-4 flex flex-col'>
      <h1 className='text-2xl text-white font-semibold mb-4'>ルームメイ</h1>
      <div className='text-white-400 flex-grow overflow-y-auto mb-4'>メッセージ達</div>

      <div className='flex-shrink-0 relative'>
        <input
          type='text'
          placeholder='Send a Message'
          className='border-2 rounded w-full pr-10 focus:outline-none p-2'
        />
      </div>
    </div>
  );
};

export default Chat;
