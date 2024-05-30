'use client';

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import { FaBars } from 'react-icons/fa';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <div className="relative md:flex" style={{ width: '100%' }}>
        {/* ハンバーガーメニューアイコン */}
        <button
          className="text-4xl text-white absolute left-4 top-4 md:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FaBars />
        </button>

        {/* サイドバー：スマホサイズでの表示制御 */}
        <div
          className={`${
            isSidebarOpen ? 'block bg-blackblue w-full' : 'hidden'
          } bg-custom-blue w-64 h-full absolute md:relative md:flex z-10`}
        >
          <Sidebar setIsSidebarOpen={setIsSidebarOpen} />
        </div>

        {/* チャット画面 */}
        <div className="flex-grow md:relative z-0 h-full">
          <Chat />
        </div>
      </div>
    </div>
  );
}
