/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  DocumentData,
  addDoc,
} from "firebase/firestore";

import { useEffect, useRef, useState } from "react";
import { auth } from "./firebase";
import firebase from "firebase/compat/app";
interface Message {
  id: string;
  text: string;
  uuid: string;
  photoUrl: string;
  createdAt: string;
}
interface MessageProps {
  message: Message;
}

function MessageChat(props: MessageProps) {
  const { text, photoUrl } = props.message;
  const messageContainerClass =
    props.message.uuid === auth.currentUser?.uid
      ? "flex items-end justify-end px-2 mb-5"
      : "flex items-start justify-start px-2 mb-5";
  const messageClass =
    props.message.uuid === auth.currentUser?.uid
      ? "bg-blue-500 rounded-br-none"
      : "bg-gray-400 rounded-bl-none";
  return (
    <div className={`${messageContainerClass} gap-2`}>
      <img src={photoUrl} alt="profile" className="w-10 h-10 rounded-full" />

      <div
        className={`${messageClass} flex-wrap min-w-48 p-2 min-h-8 flex items-center rounded-full gap-3 `}
      >
        <p className="break-words max-w-48 p-2">{text}</p>
      </div>
    </div>
  );
}

export default function ChatRoom({ db }: { db: any }) {
  const [messages, setMessages] = useState<DocumentData[]>();
  const [inputMessage, setInputMessage] = useState<string>();
  const dummy = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const messagesCollection = collection(db, "messages");
    const q = query(messagesCollection, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesList);
    });
    return unsubscribe;
  }, [db]);

  const sendMessage = async () => {
    try {
      const message = {
        text: inputMessage,
        uuid: auth.currentUser?.uid,
        photoUrl: auth.currentUser?.photoURL,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: auth.currentUser?.displayName,
      };
      const messages = collection(db, "messages");
      await addDoc(messages, message);
      dummy.current?.scrollIntoView({ behavior: "smooth" });
      setInputMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="rounded-2xl w-[400px] h-[600px] flex flex-col justify-end bg-gray-800">
      <div className="overflow-y-scroll bg-gray-600 rounded-2xl h-full flex justify-end flex-col">
        {messages?.map((message) => (
          <MessageChat
            key={message.id}
            message={{
              id: message.id,
              text: message.text,
              uuid: message.uuid,
              photoUrl: message.photoUrl,
              createdAt: message.createdAt,
            }}
          />
        ))}
        <div ref={dummy}></div>
      </div>
      <div className="flex justify-between items-center gap-3 mb-3 mx-5 mt-5 bg">
        <input
          className="text-black p-2 rounded-full  w-full h-10 "
          value={inputMessage || ""}
          onChange={(e) => {
            setInputMessage(e.target.value);
          }}
        />
        <div>
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white h-12 w-12 p-2 rounded-full hover:bg-blue-600 transition"
          >
            <span className="text-2xl font-bold">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}
