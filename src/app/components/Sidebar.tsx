'use client';

import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { auth, db } from '../../../firebase';
import { TRoom } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { AiOutlineClose } from 'react-icons/ai';

type TSidebarProps = {
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

const Sidebar: React.FC<TSidebarProps> = ({ setIsSidebarOpen }) => {
  const { user, userId } = useAppContext();
  const [rooms, setRooms] = useState<TRoom[]>([]);
  const { setSelectedRoom, isLoading, selectedRoom } = useAppContext();

  useEffect(() => {
    if (user) {
      const fetchRooms = async () => {
        const roomCollectionRef = collection(db, 'rooms');
        const q = query(roomCollectionRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));

        // onSnapshotでリアルタイム更新があるため、unsubscribeでメモリリークを防ぐ
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const newRooms: TRoom[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            createdAt: doc.data().createdAt,
          }));

          setRooms(newRooms);
        });

        return () => {
          unsubscribe();
        };
      };

      fetchRooms();
    }
  }, [userId, user]);

  const selectRoom = (room: TRoom) => {
    // メッセージのローディング中は他のチャットルームを選択できないようにする
    if (isLoading) return;

    setIsSidebarOpen(false);
    setSelectedRoom(room);
  };

  const handleLogout = () => {
    auth.signOut();
  };

  const addNewRoom = async () => {
    const roomName = prompt('ルーム名を入力してください。');
    if (roomName) {
      const newRoomRef = collection(db, 'rooms');
      await addDoc(newRoomRef, {
        name: roomName,
        userId: userId,
        createdAt: serverTimestamp(),
      });
    }
  };

  return (
    <div className='bg-custom-blue h-full overflow-y-auto px-5 flex flex-col'>
      <div className='flex-grow'>
        <div className='flex justify-between items-center w-full'>
          <div
            className='cursor-pointer w-full flex justify-center items-center border mt-2 rounded-md hover:bg-blue-800 duration-150'
            onClick={addNewRoom}
          >
            <span className='text-white p-4 text-lg'>＋ 新規チャット</span>
          </div>
          {/* PC サイズの場合は非表示にする */}
          <button
            onClick={() => setIsSidebarOpen(false)} // バツボタンを押した時にサイドバーを閉じる
            className='text-white text-2xl p-2 hover:bg-red-500 rounded-md sm:hidden'
          >
            <AiOutlineClose />
          </button>
        </div>
        <ul className='text-white-400 mt-4'>
          {rooms.map((room) => (
            <li
              key={room.id}
              onClick={() => selectRoom(room)}
              className='cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-700 duration-150 '
            >
              {room.name}
            </li>
          ))}
        </ul>
      </div>

      {user && <div className='mb-2 p-4 text-slate-100 text-lg font-medium'>{user.email}</div>}
      <div
        className='text-lg flex items-center justify-evenly mb-2 cursor-pointer p-4 text-slate-100 hover:bg-slate-700 duration-150'
        onClick={() => handleLogout()}
      >
        <BiLogOut />
        <span>ログアウト</span>
      </div>
    </div>
  );
};

export default Sidebar;
