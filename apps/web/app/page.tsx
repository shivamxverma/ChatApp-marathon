'use client'
import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import axios from "axios";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:8080');

    newSocket.onopen = () => {
      console.log("Connected to WebSocket server.");
      setSocket(newSocket);
    };

    newSocket.onmessage = (event) => {
      const msg = event.data;
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    newSocket.onerror = (error: any) => {
      console.error('WebSocket error:', error);
    };

    newSocket.onclose = () => {
      console.log('WebSocket is closed');
    };

    return () => {
      newSocket.close();
    };
  }, []);

  const handleMessage = () => {
    if (socket && message.trim()) {
      socket.send(message);
      setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
      setMessage('');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center' }}>Simple Chat App</h1>
      
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={message}
          placeholder="Enter your message..."
          onChange={(e) => setMessage(e.target.value)}
          style={{
            width: '75%',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
        <button
          onClick={handleMessage}
          style={{
            padding: '0.5rem 1rem',
            marginLeft: '0.5rem',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#007BFF',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
      
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px', padding: '0.5rem' }}>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {messages.map((msg, index) => (
            <li key={index} style={{ marginBottom: '0.5rem', padding: '0.5rem', backgroundColor: '#f1f1f1', borderRadius: '4px' }}>
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
