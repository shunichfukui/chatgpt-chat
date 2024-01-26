import { Timestamp } from 'firebase/firestore';

export type TMessage = {
  text: string;
  sender: string;
  createdAt: Timestamp;
};
