'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { family } from '@/data/familymembers'
import { events, packingLists } from '@/data/events'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, addDays, getDay } from 'date-fns'
import { parseDate } from 'chrono-node'
import shortHash from "shorthash2";
import { ParsedTag, Message, Weather, FamilyEvent, PackingLists, PackingListItem, DayOverview, FamilyType } from '@/types';
import { CoreToolResult } from 'ai'
import superjson from 'superjson'

export interface FamilyContextType {
  family: FamilyType
  events: FamilyEvent[]
  activeDate: Date
  setActiveDate: React.Dispatch<React.SetStateAction<Date>>
  daysInMonth: Date[]
  dayOverviews: Record<string, DayOverview>
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  updateEvent: (newEvent: FamilyEvent | Record<string, any>) => void
  createEvent: (newEvent: FamilyEvent) => void
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  eventFromCommand: (command: ParsedTag) => FamilyEvent | null
  weather: Weather
  eventFromToolCall: (toolCall: CoreToolResult<string, any, any>) => FamilyEvent | null
}


const pearOpeners = [
  "I’m all ears (and stems)! Let’s chat about your plans!",
  "Got a pearplexing question? Let’s sort it out together!",
  "Feeling pearfectly helpful today—what can I do for you?",
  "Juicy ideas on your mind? Let’s peel away at them together!",
  "I’m here to help! Let’s make your day a little more pear-fect.",
  "I’m here to make your life a little sweeter—what’s on the agenda?",
  "Let’s pear down your to-do list—what needs tackling?",
  "Got a pear of questions? I’ve got a bunch of answers!",
  "Let’s pick out the ripest ideas together!",
  "I’m ready to lend a stem—just tell me what you need!",
  "I’m here to pear off the pressure! Where should we start?",
  "Ready to plan things out and make your day pear-fect! How can I help?",
  "Got a juicy question? I’m ready to help you get to the core!",
  "Need some help? I’m ripe with ideas!",
  "Let’s make today a little more pearsonal—what can I do for you?",
  "Hope your day is pear-fect! How can I help you today?",
  "Hello! Let’s find the pear-fect solution to whatever you need!",
  "Good day! Let’s pear things up—what do you need?",
  "Hey there! Ready to pear-form some magic together?",
  "Top of the day to you! How can I make your day a little sweeter?",
  "Hey there! How can I make today pear-fect for you?",
  "Good day! I’m ripe and ready to lend a hand—what’s the plan?",
  "Hey, pear-tner! What can I help with today?",
  "Hello there! What can I do to pear-k up your day?",
  "Good to see you! Let’s make your day sweeter—what do you need?",
  "Hello! Let’s plan things pear-fectly together!",
  "I’m here to help with any pear-tinent details. What's on your mind?",
  "Hope your day is going smoothly! How can I lend a stem?",
  "Happy day! Let’s get to the core of what you need help with!"  
]

const FamilyContext = createContext<FamilyContextType | undefined>(undefined)

export function useFamily() {
  const context = useContext(FamilyContext)
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider')
  }
  return context
}

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const [activeDate, setActiveDate] = useState<Date>(new Date())
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([])
  const [dayOverviews, setDayOverviews] = useState<Record<string, DayOverview>>({})
  const [messages, setMessages] = useState<Message[]>([{
    text: pearOpeners[0],
    sender: 'assistant'
  }])
  const [weather, setWeather] = useState<Weather>({
    precipitation: "NONE",
    temperature: 80
  })

  const [_events, setEvents] = useState<FamilyEvent[]>(events)

  useEffect(() => {
    const today = new Date()
    setActiveDate(today)
    const startDate = startOfMonth(today)
    const endDate = endOfMonth(today)
    setDaysInMonth(eachDayOfInterval({ start: startDate, end: endDate }))
    setMessages([{
      text: pearOpeners[Math.floor(Math.random() * pearOpeners.length)],
      sender: 'assistant'
    }])
  }, [])

  useEffect(() => {
    const startDate = startOfMonth(activeDate)
    const endDate = endOfMonth(activeDate)
    setDaysInMonth(eachDayOfInterval({ start: startDate, end: endDate }))
    const today = new Date()
    const temperature = isSameDay(today, activeDate) ? 81 : isSameDay(addDays(today, 1), activeDate) ? 62 : isSameDay(addDays(today, 2), activeDate) ? 43 : getDay(activeDate) + 70
    const precipitation = isSameDay(today, activeDate) ? "NONE" : isSameDay(addDays(today, 1), activeDate) ? "RAIN" : isSameDay(addDays(today, 2), activeDate) ? "HAIL" : undefined
    setWeather({
      precipitation: precipitation,
      temperature: temperature
    })
  }, [activeDate])

  useEffect(() => {
    const newDayOverviews: Record<string, DayOverview> = {}

    // const is_today = isSameDay(today, activeDate)
    // const is_tomorrow = isSameDay(addDays(today, 1), activeDate)
    // const is_next_week = isSameDay(addDays(today, 7), activeDate)

    const weather_considerations: string[] = weather.precipitation ? [weather.precipitation] : []
    if (weather.temperature && weather.temperature < 50) {
      weather_considerations.push("COLD")
    }

    family.members.forEach(member => {
      const memberEvents = _events.filter(event => 
        event.familyMembers.some(fm => fm.name === member.name) && 
        (isSameDay(activeDate, event.start) || isSameDay(activeDate, event.end))
      )

      const transportingEvents = _events.filter(event => (isSameDay(activeDate, event.start) || isSameDay(activeDate, event.end)) && (event.transporting_to?.name === member.name || event.transporting_from?.name === member.name))

      const isTypical = !memberEvents.some(event => event.adjustments && event.adjustments.length > 0) && !transportingEvents.some(event => event.adjustments && event.adjustments.length > 0)

      const atypicalEvents = memberEvents
        .filter(event => event.adjustments && event.adjustments.length > 0)
        .flatMap(event => event.adjustments?.map(adj => `${event.title} ${adj}`) || [])

      const hourlySchedule = memberEvents.filter(event => !event.adjustments || !event.adjustments.includes("CANCELLED")).map(event => ({
        start: event.start,
        end: event.end,
        activity: event.title,
        location: event.location,
        notes: `${event.transporting_to ? "Dropoff: " + event.transporting_to?.name + ", " : ""}${event.transporting_from ? "Pickup: " + event.transporting_from?.name : ""}`
      }))

      // Generate packing list
      const packingList = new Set<string>()
      memberEvents.forEach(event => {
        if (!event?.adjustments || !event.adjustments.includes("CANCELLED")) {
        const eventTitle = event.title as keyof PackingLists
        if (eventTitle in packingLists) {
          const eventPackingList = packingLists[eventTitle] as PackingListItem
          // Add default items
          eventPackingList.default.forEach(item => packingList.add(item))
          // Add member-specific items if they exist
          if (member.name in eventPackingList) {
            eventPackingList[member.name].forEach(item => packingList.add(item))
            }

            for (const weather_consideration of weather_considerations) {
              if (weather_consideration in eventPackingList) {
                eventPackingList[weather_consideration].forEach(item => {
                  packingList.add(item)
                  atypicalEvents.push(`Pack ${item} for ${event.title} due to ${weather_consideration}`)
                })
              }
            }
          
          }
          
        }
      })

      for(const event of transportingEvents) {
        if (event.transporting_to?.name === member.name) {
          if (event?.adjustments && event.adjustments.includes("CANCELLED")) {
            for (const adjustment of event.adjustments) {
              atypicalEvents.push(`${event.title} (${event.familyMembers.map(fm=>fm.name).join(', ')}) ${adjustment}`)
            }
          } else {
        hourlySchedule.push({
          start: event.start,
          end: event.start,
          activity: `Take ${event.familyMembers.map(fm=>fm.name).join(', ')} to ${event.title}`,
              location: event.location,
              notes: ``
            })
          }
        }
        if (event.transporting_from?.name === member.name) {
          if (event?.adjustments && event.adjustments.includes("CANCELLED")) {
            for (const adjustment of event.adjustments) {
              atypicalEvents.push(`${event.title} (${event.familyMembers.map(fm=>fm.name).join(', ')}) ${adjustment}`)
            }
          } else {
            hourlySchedule.push({
              start: event.end,
              end: event.end,
              activity: `Pick up ${event.familyMembers.map(fm=>fm.name).join(', ')} from ${event.title}`,
              location: event.location,
              notes: ``
            })
          }
        }
      }

      newDayOverviews[member.name] = {
        isTypical,
        summary: isTypical 
          ? `${format(activeDate, 'EEEE')} as usual`
          : `${format(activeDate, 'EEEE')} is a little different than usual`,
        hourlySchedule,
        packingList: Array.from(packingList),
        otherNotes: [],
        atypicalEvents,
        weatherConsiderations: weather_considerations,
      }
    })

    setDayOverviews(newDayOverviews)
  }, [activeDate, _events, weather])

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const updateEvent = (newEvent: FamilyEvent | Record<string, any>) => {
    console.log(newEvent)
    setEvents((evs) => evs.map(event => event.id === newEvent.id ? {...event, ...newEvent} : event))
  }

  const createEvent = (newEvent: FamilyEvent) => {
    setEvents((evs) => [...evs, {
      ...newEvent, 
      id: shortHash(newEvent.start.toISOString())
    }])
  }

  const eventFromToolCall = (toolCall: CoreToolResult<string, any, any>) => {
    console.log("TOOL CALL")
    console.log(toolCall)
    console.log("ARG KEYS")
    console.log(Object.keys(toolCall.args))

    let event: FamilyEvent = {} as FamilyEvent
    if (toolCall.toolName === "updateEvent") {
      event = superjson.deserialize(superjson.serialize(_events.find(e => e.id === toolCall.args?.id) ?? {} as FamilyEvent))
      if (!event) return null
    }

    if (toolCall.args?.start_time) {
      event.start = parseDate(
        `${toolCall.args?.start_time} ${toolCall.args?.date ?? event.start ?? new Date()}`) ?? new Date()
    } 
    if (toolCall.args?.end_time) {
      event.end = parseDate(`${toolCall.args?.end_time} ${toolCall.args?.date ?? event.end ?? new Date()}`) ?? new Date()
    }

    if (toolCall.args?.transporting_to) {
      event.transporting_to = family.members.find(f => f.name === toolCall.args?.transporting_to)
    }
    if (toolCall.args?.transporting_from) {
      event.transporting_from = family.members.find(f => f.name === toolCall.args?.transporting_from)
    }

    if (toolCall.args?.familyMembers_add){
      event.familyMembers = [...event.familyMembers, ...toolCall.args.familyMembers_add.map((name: string) => family.members.find(f => f.name === name.trim()) ?? {name: name.trim(), role: "Child", activities: []})]
    }
    if (toolCall.args?.familyMembers_remove){
      event.familyMembers = event.familyMembers.filter(fm => !toolCall.args.familyMembers_remove.includes(fm.name))
    }

    if (toolCall.args?.adjustments_add){
      event.adjustments = event.adjustments ? [...event.adjustments, ...toolCall.args.adjustments_add] : toolCall.args.adjustments_add
    }
    if (toolCall.args?.adjustments_remove){
      event.adjustments = event.adjustments ? event.adjustments.filter(adj => !toolCall.args.adjustments_remove.includes(adj)) : []
    }




    if (toolCall.args?.familyMembers) {
      event.familyMembers = toolCall.args.familyMembers.map((name: string) => family.members.find(f => f.name === name.trim()) ?? {name: name.trim(), role: "Child", activities: []})
    }
      
    for (const key of Object.keys(toolCall.args)) {
      
      if (!["transporting_to", "transporting_from"].includes(key)) {

        const validKeys: (keyof FamilyEvent)[] = ["start", "end", "title", "wholeFamily", "location", "special"];

        for (const key of Object.keys(toolCall.args)) {
          if (validKeys.includes(key as keyof FamilyEvent) && toolCall.args[key] !== undefined) {
            (event as any)[key] = toolCall.args[key];
          }
        }
      
      }

      

      
    }

    console.log("EVENT")
    console.log(event)
    return event
  
}

  const eventFromCommand = (command: ParsedTag) : FamilyEvent | null => {

      
    if (command.params?.type == "event" && command.params?.id) {
      return _events.find(e => e.id === command.params?.id) ?? null
    }
    
    const newEvent: FamilyEvent = {} as FamilyEvent
    
    if (command.params?.title) {
      newEvent.title = command.params.title
    } else {
      return null
    }
    if (command.params?.date && command.params?.start && command.params?.end) {
      newEvent.start = parseDate((command.params?.start ?? "") + " " + command.params.date) ?? new Date()
      newEvent.end = parseDate((command.params?.end ?? "") + " " + command.params.date) ?? new Date()
      
    } else {
      return null
    }
    if (command.params?.familymembers) {
      newEvent.familyMembers = command.params.familymembers.split(",").map(name => family.members.find(f => f.name === name.trim()) ?? {name: name.trim(), role: "Child", activities: []})
    } else {
      return null
    }
    if (command.params?.location) {
      newEvent.location = command.params.location
    } else {
      newEvent.location = "Unknown"
    }
    if (command.params?.transporting_to) {
      newEvent.transporting_to = family.members.find(f => f.name === command.params.transporting_to)
    }
    if (command.params?.transporting_from) {
      newEvent.transporting_from = family.members.find(f => f.name === command.params.transporting_from)
    }
    newEvent.id = shortHash(newEvent.title + newEvent.start.toISOString())
    newEvent.special = true
    return newEvent
  }

  return (
    <FamilyContext.Provider
      value={{
        family,
        events: _events,
        activeDate,
        setActiveDate,
        daysInMonth,
        dayOverviews,
        updateEvent,
        createEvent,
        messages,
        setMessages,
        eventFromCommand,
        weather,
        eventFromToolCall
      }}
    >
      {children}
    </FamilyContext.Provider>
  )
}
