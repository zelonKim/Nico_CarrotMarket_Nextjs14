"use client";

import { saveMessage } from "@/app/chats/[id]/actions";
import { InitialChatMessages } from "@/app/chats/[id]/page";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SUPABASE_PUBLIC_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xbG9waG9ybHdodmNkb2Fkb2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkxMTY4NjAsImV4cCI6MjAzNDY5Mjg2MH0.aWUIWfvsaQwmanF_kYxftKmBlgaMjIzgSgbZviVLAh0"
const SUPABASE_URL="https://oqlophorlwhvcdoadoeb.supabase.co"


interface ChatMessageListProps {
    initialMessages: InitialChatMessages;
    userId: number;
    chatRoomId: string;
    username: string;
    avatar: string;
}


export default function ChatMessagesList({initialMessages, userId, chatRoomId, username, avatar}: ChatMessageListProps ){
    const [messages, setMessages] = useState(initialMessages);
    const [message, setMessage] = useState("");
    
    const channel = useRef<RealtimeChannel>();

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: {value}
        } = event;
        setMessage(value);
    }

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessages(prevMsgs => [...prevMsgs, {
            id: Date.now(),
            payload: message,
            created_at: new Date(),
            userId,
            user: {
                username: "string",
                avatar: "aaa",
            }
        }]);

        channel.current?.send({ // 채널.send({ type:"타입명", event:"이벤트명", payload:{페이로드} }): 해당 채널로 인수들을 보냄.
            type:"broadcast",
            event: "message",
            payload: {
                id: Date.now(),
                payload: message,
                created_at: new Date(),
                userId,
                user: {
                    username,
                    avatar,
                }
            }
        });
        await saveMessage(message, chatRoomId);
        setMessage("");
    }



    useEffect(()=> {
        const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY); // createClient(SupabaseURL, Supabase퍼블릭키): 새로운 Supabase 클라이언트를 생성함.
        channel.current = client.channel(`room-${chatRoomId}`); // Supabase클라이언트.channel(채널명): 실시간 채널을 생성함.
        channel.current.on("broadcast", {event: "message"}, (args) => { // 채널.on("타입명", {event: "이벤트명"}, 콜백함수): 채널을 설정함.  // 콜백함수의 매개변수에는 채널.send()메서드로 보낸 인수들이 담김.
          setMessages(prevMsgs => [...prevMsgs, args.payload])
        }).subscribe() // 채널.subscribe(): 채널을 서버에서 시작함.

        return () => {
            channel.current?.unsubscribe(); // 채널.unsubscribe(): 채널을 서버에서 종료함.
        }
    }, [chatRoomId])

    

    return (
        <div className="p-5 flex flex-col gap-5 min-h-screen justify-end">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 items-start ${
                message.userId === userId ? "justify-end" : ""
              }`}
            >
              {message.userId === userId ? null : (
                <Image
                  src={message.user.avatar!}
                  alt={message.user.username}
                  width={50}
                  height={50}
                  className="size-8 rounded-full"
                />
              )}
              <div
                className={`flex flex-col gap-1 ${
                  message.userId === userId ? "items-end" : ""
                }`}
              >
                <span
                  className={`${
                    message.userId === userId ? "bg-neutral-500" : "bg-orange-500"
                  } p-2.5 rounded-md`}
                >
                  {message.payload}
                </span>
                <span className="text-xs">
                  {formatToTimeAgo(message.created_at.toString())}
                </span>
              </div>
            </div>
          ))}
          <form className="flex relative" onSubmit={onSubmit}>
            <input
              required
              onChange={onChange}
              value={message}
              className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
              type="text"
              name="message"
              placeholder="Write a message..."
            />
            <button className="absolute right-0">
              <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
            </button>
          </form>
        </div>
      );
    }