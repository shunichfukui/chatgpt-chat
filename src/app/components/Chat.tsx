'use client';
import { FaPaperPlane } from 'react-icons/fa';
import React, { useEffect, useRef, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { useAppContext } from '@/context/AppContext';
import { TMessage } from '@/types';
import OpenAI from 'openai';
import { GPT_VERSION } from '@/consts';
import LoadingIcons from 'react-loading-icons';
import useRoomNameFilter from '@/hooks/useRoomNameFilter';

const Chat = () => {
  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<TMessage[]>([]);
  const { userId, selectedRoom, setSelectedRoom, isLoading, setIsLoading } = useAppContext();

  const scrollDiv = useRef<HTMLDivElement>(null);

  // メッセージが送信された際に下にスクロールする
  useEffect(() => {
    if (scrollDiv.current) {
      const element = scrollDiv.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  // 各ルームにおけるメッセージを取得
  useEffect(() => {
    if (selectedRoom) {
      const fetchMessages = async () => {
        const roomDocRef = doc(db, 'rooms', selectedRoom.id);
        const messagesCollectionRef = collection(roomDocRef, 'messages');

        const q = query(messagesCollectionRef, orderBy('createdAt'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const newMessages = snapshot.docs.map((doc) => doc.data() as TMessage);
          setMessages(newMessages);
        });

        return () => {
          unsubscribe();
        };
      };

      fetchMessages();
    }
  }, [selectedRoom]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    setIsLoading(true);

    // selectedRoomが存在しない場合、新しいルームを作成
    let roomDocRef;

    if (!selectedRoom) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const roomName = useRoomNameFilter(inputMessage);
      const newRoomRef = await addDoc(collection(db, 'rooms'), {
        name: roomName,
        userId: userId,
        createdAt: serverTimestamp(),
      });
      roomDocRef = doc(db, 'rooms', newRoomRef.id);
      console.log(roomDocRef, 'roomDocRef');

      // 新しいルームをselectedRoomに設定
      setSelectedRoom({ id: newRoomRef.id, name: roomName, createdAt: new Date() });
    } else {
      roomDocRef = doc(db, 'rooms', selectedRoom.id);
    }
    if (isLoading) {
      return;
    }

    const messageData = {
      text: inputMessage,
      sender: 'user',
      createdAt: serverTimestamp(),
    };

    //メッセージをFirestoreに保存
    const messageCollectionRef = collection(roomDocRef, 'messages');
    await addDoc(messageCollectionRef, messageData);

    setInputMessage('');

    try {
      //OpenAIからの返信
      const gptResponse = await openai.chat.completions.create({
        messages: [{ role: 'user', content: inputMessage }],
        model: GPT_VERSION,
      });

      const botResponse = gptResponse.choices[0].message.content;

      await addDoc(messageCollectionRef, {
        text: botResponse,
        sender: 'bot',
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error sending message to OpenAI:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-blackblue secondary h-full p-4 flex flex-col">
      <div className="flex-grow overflow-y-auto mb-4" ref={scrollDiv}>
        {messages.map((message, index) => (
          <div key={index} className={message.sender === 'user' ? 'text-right' : 'text-left'}>
            <div
              className={
                message.sender === 'user'
                  ? 'bg-blue-700 inline-block rounded px-4 py-2 mb-2'
                  : 'bg-green-700 inline-block rounded px-4 py-2 mb-2'
              }
            >
              <p className="text-white">{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && <LoadingIcons.TailSpin />}
      </div>

      <div className="flex-shrink-0 relative">
        <textarea
          placeholder="Send a Message"
          onChange={(e) => setInputMessage(e.target.value)}
          value={inputMessage}
          className="border-2 rounded w-full pr-10 focus:outline-none p-2 h-11"
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <button
          className="absolute inset-y-0 right-4 flex items-center"
          onClick={() => sendMessage()}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chat;
