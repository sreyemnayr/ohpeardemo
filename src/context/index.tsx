'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { family } from '@/data/familymembers'
import { events, packingLists } from '@/data/events'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, addDays, getDay } from 'date-fns'
import { parseDate } from 'chrono-node'
import shortHash from "shorthash2";
import { ParsedTag, FamilyContextType, Message, Weather, FamilyEvent, PackingLists, PackingListItem, DayOverview } from '@/types';


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
    text: "Hello! How can I help you today?",
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
  }, [activeDate, family, _events, weather])

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
        weather
      }}
    >
      {children}
    </FamilyContext.Provider>
  )
}
