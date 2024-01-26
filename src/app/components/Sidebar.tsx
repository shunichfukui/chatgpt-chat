'use client';

import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { db } from '../../../firebase';
import { TRoom } from '@/types';
import { useAppContext } from '@/context/AppContext';

const Sidebar = () => {
  const { user, userId } = useAppContext();
  const [rooms, setRooms] = useState<TRoom[]>([]);
  const { setSelectedRoom } = useAppContext();

  useEffect(() => {
    if (user) {
      const fetchRooms = async () => {
        const roomCollectionRef = collection(db, 'rooms');
        const q = query(roomCollectionRef, where('userId', '==', userId), orderBy('createdAt'));

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

  const selectRoom = (roomId: string) => {
    setSelectedRoom(roomId);
  };

  return (
    <div className='bg-custom-blue h-full overflow-y-auto px-5 flex flex-col'>
      <div className='flex-grow'>
        <div className='cursor-pointer flex justify-evenly items-center border mt-2 rounded-md hover:bg-blue-800 duration-150'>
          <span className='text-white p-4 text-lg'>＋</span>
          <h1 className='text-white text-xl font-semibold p-4'>新しいチャット</h1>
        </div>
        <ul className='text-white-400 mt-4'>
          {rooms.map((room) => (
            <li
              key={room.id}
              onClick={() => selectRoom(room.id)}
              className='cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-700 duration-150 '
            >
              {room.name}
            </li>
          ))}
        </ul>
      </div>

      <div className='text-lg flex items-center justify-evenly mb-2 cursor-pointer p-4 text-slate-100 hover:bg-slate-700 duration-150'>
        <BiLogOut />
        <span>ログアウト</span>
      </div>
    </div>
  );
};

export default Sidebar;
