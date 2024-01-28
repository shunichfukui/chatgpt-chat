'use client';
import { FaPaperPlane } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useAppContext } from '@/context/AppContext';
import { TMessage } from '@/types';
import OpenAI from 'openai';
import { GPT_VERSION } from '@/consts';
import LoadingIcons from 'react-loading-icons';

const Chat = () => {
  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { selectedRoom } = useAppContext();

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  // 各ルームにおけるメッセージを取得
  useEffect(() => {
    if (selectedRoom) {
      const fetchMessages = async () => {
        const roomDocRef = doc(db, 'rooms', selectedRoom);
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

    const messageData = {
      text: inputMessage,
      sender: 'user',
      createdAt: serverTimestamp(),
    };

    //メッセージをFirestoreに保存
    const roomDocRef = doc(db, 'rooms', selectedRoom!);
    const messageCollectionRef = collection(roomDocRef, 'messages');
    await addDoc(messageCollectionRef, messageData);

    setInputMessage('');
    setIsLoading(true);

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

    setIsLoading(false);
  };

  return (
    <div className='bg-blackblue secondary h-full p-4 flex flex-col'>
      <h1 className='text-2xl text-white font-semibold mb-4'>ルームメイ</h1>
      <div className='flex-grow overflow-y-auto mb-4'>
        {messages.map((message, index) => (
          <div key={index} className={message.sender === 'user' ? 'text-right' : 'text-left'}>
            <div
              className={
                message.sender === 'user'
                  ? 'bg-blue-700 inline-block rounded px-4 py-2 mb-2'
                  : 'bg-green-700 inline-block rounded px-4 py-2 mb-2'
              }
            >
              <p className='text-white'>{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && <LoadingIcons.TailSpin />}
      </div>

      <div className='flex-shrink-0 relative'>
        <input
          type='text'
          placeholder='Send a Message'
          onChange={(e) => setInputMessage(e.target.value)}
          className='border-2 rounded w-full pr-10 focus:outline-none p-2'
        />
        <button className='absolute inset-y-0 right-4 flex items-center' onClick={() => sendMessage()}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chat;
