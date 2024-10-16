import React from 'react'
import { FamilyEvent } from '@/data/events'
import { format, isSameDay, addDays, isBefore, startOfDay, getDay } from 'date-fns'
import { useFamily } from '@/context'
import * as Tooltip from '@radix-ui/react-tooltip'

type FamilyCalendarProps = {
  events: FamilyEvent[]
}

export default function FamilyCalendar({ events }: FamilyCalendarProps) {
  const { activeDate, setActiveDate, daysInMonth } = useFamily()
  const actuallyToday = startOfDay(new Date())
  const today = activeDate

  const getEventsForDate = (date: Date) => events.filter(event => 
    isSameDay(date, event.start) || isSameDay(date, event.end)
  )

  const getSpecialEventsForDate = (date: Date) => events.filter(event => 
    (isSameDay(date, event.start) || isSameDay(date, event.end)) && (event?.special || (event?.adjustments && event.adjustments.length > 0))
  )

  const handleDateClick = (date: Date) => {
    setActiveDate(date)
  }

  const getDayTitle = (date: Date) => {
    if (isSameDay(date, actuallyToday)) return "Today"
    if (isSameDay(date, addDays(actuallyToday, 1))) return "Tomorrow"
    if (isSameDay(date, addDays(actuallyToday, -1))) return "Yesterday"
    return format(date, 'EEEE')
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gun-metal mb-2">{format(today, 'MMMM yyyy')}</h3>
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-raisin-black">
              {day}
            </div>
          ))}
          {Array.from({ length: daysInMonth?.[0]?.getDay() || 0 }).map((_, index) => (
            <div key={index} className="aspect-square"></div>
          ))}
          {daysInMonth.map(date => {
            // const dayEvents = getEventsForDate(date)
            const specialEvents = getSpecialEventsForDate(date)
            return (
              <div
                key={date.toString()}
                onClick={() => handleDateClick(date)}
                className={`m-1 text-center aspect-square flex items-center justify-center hover:outline hover:cursor-pointer rounded-full ${
                  isBefore(date, actuallyToday)
                    ? 'opacity-50'
                    : ''
                } ${isSameDay(date, activeDate) ? specialEvents.length > 0 ? 'bg-dark-tangerine text-white hover:bg-white hover:text-dark-tangerine hover:outline-dark-tangerine rounded-full ' : 'bg-mint text-white hover:bg-white hover:text-mint hover:outline-mint rounded-full ' : ''
                } ${specialEvents.length > 0 ? ' outline-dark-tangerine text-dark-tangerine' : 'text-gun-metal'} ${isSameDay(date, actuallyToday) ? 'outline': ''}`}
              >
                <span className="text-sm">{format(date, 'd')}</span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="">
        <div className="space-y-2 border-t border-gun-metal pb-4">
          <EventList title={getDayTitle(activeDate)} events={getEventsForDate(activeDate)} size="lg" />
          </div>
        <div className="space-y-2 text-md border-t border-gun-metal">
          {Array.from({ length: 7 - getDay(activeDate) }).map((_, index) => 
            {
              const day = addDays(activeDate, index+1)
              const dayEvents = getEventsForDate(day)
              if (dayEvents.length > 0) {
                return(
                  <EventList key={day.toString()} title={getDayTitle(day)} events={dayEvents} size="md" />
                )
              } else {
                return null
              }
            }  
          )}
        </div>
      </div>
    </div>
  )
}

function EventList({ title, events, size }: { title: string; events: FamilyEvent[], size: 'lg' | 'md' }) {
  return (
    <div className="mt-4">
      <h3 className={`text-${size === 'lg' ? 'lg' : 'md'} font-semibold text-gun-metal mb-2`}>{title}</h3>
      {events.length > 0 ? (
        <ul className={`ml-4 list-none`}>
          {events.map((event, index) => {
            const both_ampm = event.start.getHours() > 12 ? event.end.getHours() > 12 : event.end.getHours() < 12
            return(
            <li key={index} className={`text-${size === 'lg' ? 'md' : 'sm'} text-raisin-black flex flex-row justify-between gap-2`}>
              {!event?.adjustments?.includes("CANCELLED") ? (
              <span className="flex-grow whitespace-nowrap text-xs">
              
                {event.start.getMinutes() > 0 ? format(event.start, `h:mm${both_ampm ? '' : 'aaaaa'}`) : format(event.start, `h${both_ampm ? '' : 'aaaaa'}`)}-{event.end.getMinutes() > 0 ? format(event.end, `h:mmaaaaa${both_ampm ? '' : ' '}`) : format(event.end, `haaaaa${both_ampm ? '' : ' '}`)}
              
              </span>
              ) : (<span></span>)}
              <span className={`${event?.adjustments?.length ? 'font-semibold' : ''} ${event?.adjustments?.includes("CANCELLED") ? 'line-through' : ''} text-ellipsis overflow-hidden whitespace-nowrap hover:overflow-visible`}> {event.title}
              </span>
              <span>
              {event.familyMembers.map(member => (
                
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                
                  {member.photoUrl ? (
          <img
            src={member.photoUrl}
            alt={member.name}
            className={`w-4 h-4 rounded-full object-cover border-0 inline-block ${member.role === 'Parent' ? 'outline outline-1 outline-mint' : 'outline outline-1 outline-sea-buckthorn'}`}
            key={`${member.name}-${event.title}-${event.start}`}
          />
        ) : (
          <span  className={`text-${size === 'lg' ? 'sm' : 'xs'} inline-flex items-center justify-center flex-row ${member.role === 'Parent' ? 'bg-mint' : 'bg-sea-buckthorn'} text-white rounded-full aspect-square px-0.5 py-0.5 mx-0 w-4 h-4`} key={`${member.name}-${event.title}-${event.start}`}>
          <span className="text-center" >{member.name.slice(0, 1)}</span>
          </span>
        )}
        </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gun-metal text-white px-2 py-1 rounded text-sm"
                    sideOffset={5}
                  >
                    {member.name}
                    <Tooltip.Arrow className="fill-gun-metal" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
                 
              )
              )}
              </span>
            </li>
            
          )})}
        </ul>
      ) : (
        <p className="text-sm text-raisin-black ml-4">No events scheduled</p>
      )}
    </div>
  )
}
