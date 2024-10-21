'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Check, Trash } from 'lucide-react'
import Markdown from "react-markdown"

import { useFamily } from '@/context'
import { Message, ParsedTag, FamilyEvent } from '@/types'
import { EventSummary } from '@/components/EventSummary'
import { LogoBW } from '@/components/LogoBW'



export function LoadingDots() {
  return (
  <div className='flex space-x-2 justify-center items-center'>
 	<span className='sr-only'>Loading...</span>
  	<LogoBW className='h-3 w-3 text-gun-metal animate-bounce [animation-delay:-0.3s]'></LogoBW>
	<LogoBW className='h-3 w-3 text-gun-metal animate-bounce [animation-delay:-0.15s]'></LogoBW>
	<LogoBW className='h-3 w-3 text-gun-metal animate-bounce'></LogoBW>
</div>
  )
}



export function EventAction({ command, handleCommand }: { command: ParsedTag, handleCommand: (command: ParsedTag) => void }) {
  const [trashed, setTrashed] = useState(false)
  const [completed, setCompleted] = useState(false)
  const { eventFromCommand } = useFamily()
    
  return (
    <div className={`relative max-w-full flex flex-col gap-2 ${trashed || completed ? 'opacity-50' : ''} ${trashed ? 'line-through' : ''}`}>
      <EventSummary event={eventFromCommand(command) ?? {} as FamilyEvent} size="xs" Element="div" />
      {!completed && !trashed && (
        <>
          <button className="absolute -bottom-2 -right-2 hover:bg-mint hover:text-white bg-white text-mint outline outline-1 outline-mint rounded-full p-1" onClick={() => {handleCommand(command); setCompleted(true)}}><Check className="w-8 h-8" /></button>
          <button className="absolute -top-2 -right-2 hover:bg-mint hover:text-white bg-white text-dark-tangerine outline outline-1 outline-dark-tangerine rounded-full p-1" onClick={() => {setTrashed(true)}}><Trash className="w-4 h-4" /></button>
        </>
      )}
      
      {completed && <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-turquoise h-12 w-12 " />}
      {trashed && <Trash className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-dark-tangerine h-12 w-12 hover:text-white" onClick={() => {setTrashed(false)}} />}
    </div>
  )
}

export function Chat() {
  const [message, setMessage] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { eventFromCommand, updateEvent, createEvent, family, messages, setMessages, events } = useFamily()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }

  useEffect(scrollToBottom, [messages]);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage()
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendEmail()
  }

  

  const handleCommand = (command: ParsedTag) => {
    
    if (command.name === "update") {
      const event = eventFromCommand(command)
      console.log(event)
      console.log(events.find(e => e.id === command.params?.id))
      if (!event) return
      if (command.params?.type == "event"){
        if (command.params?.field == "adjustments") {
          updateEvent({id: command.params.id, adjustments: [command.params.value]})
        } else {
          if (["transporting_from", "transporting_to"].includes(command.params.field)) {
            updateEvent({id: command.params.id, [command.params.field]: family.members.find(f => f.name === command.params.value), adjustments: [`UPDATED ${command.params.field}`]})
          } else if (["familyMembers"].includes(command.params.field)) {
            updateEvent({id: command.params.id, familyMembers: event.familyMembers.filter(fm => fm.name === command.params.value), adjustments: [`UPDATED ${command.params.field}`]})
          } else {
            updateEvent({id: command.params.id, [command.params.field]: command.params.value, adjustments: [`UPDATED ${command.params.field}`]})
          }
        }
      } 
    }
    if (command.name == "create") {
      if (command.params?.type == "event") {
        const newEvent = eventFromCommand(command)
        if (newEvent) {
          createEvent(newEvent)
        }
      }
    }
  }

  const sendEmail = () => {
    if (emailMessage.trim() === '') return

    const newUserMessage: Message = { text: "Process this email", sender: 'user' }
    const waitingAssistantMessage: Message = { text: '...', sender: 'assistant' }

    setMessages(prevMessages => [...prevMessages, newUserMessage, waitingAssistantMessage])
    setEmailMessage('')

    fetch('/api/process/email', {
      method: 'POST',
      body: JSON.stringify({ message: emailMessage }),
    }).then(res => res.json()).then(data => {
      const new_messages: Message[] = []
      data.message.split("\n").forEach((line: string) => {
        new_messages.push({ text: line, sender: 'assistant' })
      })
      if (data?.commands) {
        (data.commands as ParsedTag[]).forEach(command => {
          new_messages.push({ Element: <EventAction command={command} handleCommand={handleCommand}  />, sender: 'update' })
        })
      }
      setMessages(prevMessages => [...prevMessages.filter(msg => msg.text !== waitingAssistantMessage.text), ...new_messages])
    })
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
      
      data.message.split("\n").forEach((line: string) => {
        new_messages.push({ text: line, sender: 'assistant' })
      })
      
      if (data?.commands) {
        (data.commands as ParsedTag[]).forEach(command => {
          new_messages.push({ Element: <EventAction command={command} handleCommand={handleCommand}  />, sender: 'update' })
        })
      }
      
      
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
        <div className="h-96 bg-turquoise rounded-lg mb-4 p-4 overflow-y-auto flex flex-col items-center">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 text-sm w-full`}>
              {msg.text && (
                <>
                {msg.text === "..." ? (
                  <LoadingDots />
                ) : (
                <Markdown 
                className={`${msg.sender === 'update' ? 'text-xs w-full' : 'text-sm max-w-[85%]'}  p-3 rounded-lg ${
                  msg.sender === 'user' 
                    ? 'bg-mint text-white rounded-br-none' 
                    : msg.sender === 'assistant' ? 'bg-white text-gun-metal rounded-bl-none' : 'bg-gun-metal text-white rounded shadow-md outline outline-1 outline-white text-xs '
                }`}
              >
                  {msg.text}
                </Markdown>
                )}
                </>
              )}
              {msg.Element && (
                  <div className="max-w-full bg-gun-metal text-white rounded shadow-md outline outline-1 outline-white">{msg.Element}</div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleChatSubmit} className="flex">
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
        <h3 className="text-sm text-gun-metal">Or, send an email:</h3>
        <form onSubmit={handleEmailSubmit} className="flex">
          <input type="text" value={emailMessage} onChange={(e) => setEmailMessage(e.target.value)} placeholder="Paste your email here..." className="flex-grow px-4 py-2 border border-gun-metal rounded-l-lg focus:outline-none focus:ring-2 focus:ring-mint" name="emailMessage" />
          <button type="submit" className="bg-mint text-white px-4 py-2 rounded-r-lg hover:bg-dark-tangerine transition-colors duration-200"><Send className="w-5 h-5" /></button>
        </form>
      </div>
    </>
  );
}

export default Chat;
