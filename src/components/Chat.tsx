'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import Markdown from "react-markdown"

import { useFamily } from '@/context'
import { ParsedTag } from '@/util/parseTags'

type Message = {
  text: string
  sender: 'user' | 'assistant' | 'update'
}

export function Chat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([{
    text: "Hello! How can I help you today?",
    sender: 'assistant'
  }])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { updateEvent } = useFamily()

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
      const new_messages: Message[] = []
      
      if (data?.commands) {
        (data.commands as ParsedTag[]).forEach(command => {
          if (command.name === "update") {
            if (command.params?.type === "cancellation") {
              if (command.params?.id) {
                updateEvent({id: command.params.id, adjustments: ["CANCELLED"]})
              }
            }
          }
          if (command?.content) {
            new_messages.push({ text: command.content, sender: 'update' })
          }
        })
      }
      new_messages.push({ text: data.message, sender: 'assistant' })
      setMessages(prevMessages => [...prevMessages.filter(msg => msg.text !== waitingAssistantMessage.text), ...new_messages])
    })

    // Simulate assistant response
    // setTimeout(() => {
    //   const assistantMessage: Message = { text: 'Hello! How can I help you today?', sender: 'assistant' }
    //   setMessages(prevMessages => [...prevMessages.filter(msg => msg.text !== waitingAssistantMessage.text), assistantMessage])
    // }, 1000)
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg p-2">
        <div className="h-96 bg-turquoise rounded-lg mb-4 p-4 overflow-y-auto flex flex-col">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 text-sm`}>
              <Markdown 
                className={`${msg.sender === 'update' ? 'text-xs w-full' : 'text-sm max-w-[85%]'}  p-3 rounded-lg ${
                  msg.sender === 'user' 
                    ? 'bg-mint text-white rounded-br-none' 
                    : msg.sender === 'assistant' ? 'bg-white text-gun-metal rounded-bl-none' : 'bg-gun-metal text-white rounded shadow-md outline outline-1 outline-white text-xs '
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
