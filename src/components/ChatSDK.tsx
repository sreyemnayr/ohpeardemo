
'use client'

import { useState, useRef, useEffect } from 'react'
import { Attachment, CoreToolResult } from "ai";
import { Check, Trash } from 'lucide-react'


import { useFamily } from '@/context'
import { FamilyEvent } from '@/types'
import { EventSummary } from '@/components/EventSummary'
import { LogoBW } from '@/components/LogoBW'
import { useChat } from "ai/react";
import { MultimodalInput } from "@/components/MultimodalInput";

import superjson from 'superjson'

import { Message as PreviewMessage } from "@/components/Message";  




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



export function EventAction({ command, handleCommand }: { command: CoreToolResult<string, any, any>, handleCommand: (command: CoreToolResult<string, any, any>) => void }) {
  const [trashed, setTrashed] = useState(false)
  const [completed, setCompleted] = useState(false)
  const { eventFromToolCall } = useFamily()
    
  return (
    <div className={`relative max-w-full flex flex-col gap-2 ${trashed || completed ? 'opacity-50' : ''} ${trashed ? 'line-through' : ''}`}>
      <EventSummary event={eventFromToolCall(command) ?? {} as FamilyEvent} size="xs" Element="div" />
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
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { updateEvent, createEvent, events, eventFromToolCall } = useFamily()

  const [toolCalls, setToolCalls] = useState<Array<any>>([])

  useEffect(() => {
    console.log(toolCalls)
  }, [toolCalls])

  const { messages, handleSubmit, input, setInput, append, isLoading, stop } =
    useChat({
      body: { events_sj: superjson.serialize(events) },
      initialMessages: [],
      onToolCall: (toolCall) => {
        setToolCalls((tc) => [...tc, toolCall])
        console.log("TOOL CALL")
        console.log(toolCall)
        return "Done. Summary should be provided next."
      }
      
    });
  
    const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      console.log(messages)
    }
  }, [messages])


  const handleToolCall = (toolCall: CoreToolResult<string, any, any>) => {
    if (toolCall.toolName == "updateEvent") {
      const newEvent = eventFromToolCall(toolCall)
      if (newEvent) {
        updateEvent(newEvent)
      }
    }
    if (toolCall.toolName == "createEvent") {
      const newEvent = eventFromToolCall(toolCall)
      if (newEvent) {
        newEvent.special = true
        createEvent(newEvent)
      }
    }
  }
  



  return (
    <>
      <div className="bg-white shadow rounded-lg p-2">
        <div className="h-96 bg-turquoise rounded-lg mb-4 overflow-y-auto flex flex-col items-center">
        <div
          
          className="flex flex-col gap-4 h-full pt-4 w-full items-center overflow-y-scroll overflow-x-hidden"
        >
          {messages.length === 0 && <div>Empty Chat </div>}

          {messages.map((message) => (
            <>
            <PreviewMessage
              key={message.id}
              role={message.role}
              content={message.content}
              attachments={message.experimental_attachments}
              
            />
            {message.toolInvocations?.filter(toolCall => toolCall.state == "result").map((toolCall) => (
              <div className="max-w-full bg-gun-metal text-white rounded shadow-md outline outline-1 outline-white text-xs" key={`${toolCall.toolCallId}-${toolCall.state}`}>
              <EventAction command={toolCall} handleCommand={handleToolCall} />
              </div>
            ))}
            </>
          ))}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>

        <form className="flex flex-row gap-2 relative items-end w-full md:max-w-[500px] max-w-[calc(100dvw-32px) px-4 md:px-0">
          <MultimodalInput
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages}
            append={append}
          />
        </form>
          <div ref={messagesEndRef} />
        </div>
        
        
        
      </div>
    </>
  );
}

export default Chat;
