'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import Markdown from "react-markdown"

type Message = {
  text: string
  sender: 'user' | 'assistant'
}

export function Chat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage()
  }


  const sendMessage = () => {
    if (message.trim() === '') return

    const newUserMessage: Message = { text: message, sender: 'user' }
    const waitingAssistantMessage: Message = { text: '...', sender: 'assistant' }
    
    
    setMessages(prevMessages => [...prevMessages, newUserMessage, waitingAssistantMessage])
    setMessage('')

    fetch('/api/chat2', {
      method: 'POST',
      body: JSON.stringify({ message: message }),
    }).then(res => res.json()).then(data => {
      setMessages(prevMessages => [...prevMessages.filter(msg => msg.text !== waitingAssistantMessage.text), { text: data.message, sender: 'assistant' }])
    })

    // Simulate assistant response
    // setTimeout(() => {
    //   const assistantMessage: Message = { text: 'Hello! How can I help you today?', sender: 'assistant' }
    //   setMessages(prevMessages => [...prevMessages.filter(msg => msg.text !== waitingAssistantMessage.text), assistantMessage])
    // }, 1000)
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gun-metal mb-8">Family Chat</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="h-96 bg-turquoise rounded-lg mb-4 p-4 overflow-y-scroll flex flex-col">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
              <Markdown 
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.sender === 'user' 
                    ? 'bg-mint text-white rounded-br-none' 
                    : 'bg-white text-gun-metal rounded-bl-none'
                }`}
              >
                {msg.text}
              </Markdown>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow px-4 py-2 border border-gun-metal rounded-l-lg focus:outline-none focus:ring-2 focus:ring-mint"
            ref={inputRef}
          />
          <input type="text" className="hidden" />
          <button
            type="submit"
            className="bg-mint text-white px-4 py-2 rounded-r-lg hover:bg-dark-tangerine transition-colors duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </>
  );
}

export default Chat;
