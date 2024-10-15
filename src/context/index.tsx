import React, { createContext, useContext, useState, useEffect } from 'react'
import { family, FamilyType } from '@/data/familymembers'
import { events, FamilyEvent, packingLists, PackingLists, PackingListItem } from '@/data/events'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, addDays } from 'date-fns'

type DayOverview = {
  isTypical: boolean
  summary: string
  hourlySchedule: { start: Date; end: Date; activity: string; location: string; notes?: string }[]
  packingList: string[]
  otherNotes: string[]
  atypicalEvents: string[]
  weatherConsiderations: string[]
}

interface FamilyContextType {
  family: FamilyType
  events: FamilyEvent[]
  activeDate: Date
  setActiveDate: React.Dispatch<React.SetStateAction<Date>>
  daysInMonth: Date[]
  dayOverviews: Record<string, DayOverview>
}

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
  }, [activeDate])

  useEffect(() => {
    const newDayOverviews: Record<string, DayOverview> = {}

    const today = new Date()

    // const is_today = isSameDay(today, activeDate)
    const is_tomorrow = isSameDay(addDays(today, 1), activeDate)

    const weather_considerations = is_tomorrow ? ["RAIN"] : []
    
    family.members.forEach(member => {
      const memberEvents = events.filter(event => 
        event.familyMembers.some(fm => fm.name === member.name) && 
        (isSameDay(activeDate, event.start) || isSameDay(activeDate, event.end))
      )

      const transportingEvents = events.filter(event => (isSameDay(activeDate, event.start) || isSameDay(activeDate, event.end)) && (event.transporting_to?.name === member.name || event.transporting_from?.name === member.name))

      const isTypical = !memberEvents.some(event => event.adjustments && event.adjustments.length > 0) && !transportingEvents.some(event => event.adjustments && event.adjustments.length > 0)

      const atypicalEvents = memberEvents
        .filter(event => event.adjustments && event.adjustments.length > 0)
        .flatMap(event => event.adjustments?.map(adj => `${event.title} ${adj}`) || [])

      const hourlySchedule = memberEvents.filter(event => !event.adjustments || !event.adjustments.includes("CANCELLED")).map(event => ({
        start: event.start,
        end: event.end,
        activity: event.title,
        location: event.location,
        notes: `Dropoff: ${event.transporting_to?.name ?? "???"}, Pickup: ${event.transporting_from?.name ?? "???"}`
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
          ? `${member.name}'s day is a typical ${format(activeDate, 'EEEE')}`
          : `${member.name}'s ${format(activeDate, 'EEEE')} is a little different than usual`,
        hourlySchedule,
        packingList: Array.from(packingList),
        otherNotes: [],
        atypicalEvents,
        weatherConsiderations: weather_considerations,
      }
    })

    setDayOverviews(newDayOverviews)
  }, [activeDate, family, events])

  return (
    <FamilyContext.Provider
      value={{
        family,
        events,
        activeDate,
        setActiveDate,
        daysInMonth,
        dayOverviews
      }}
    >
      {children}
    </FamilyContext.Provider>
  )
}
