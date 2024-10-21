import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Umbrella, MapPin, Car, User } from 'lucide-react'
import { FamilyMemberType } from '@/types'
import { useFamily } from '@/context'
import { format } from 'date-fns'
import Checklist from './Checklist'
import * as Tooltip from '@radix-ui/react-tooltip'
import LogoBW from './LogoBW'

function FamilyMemberDay({ member }: { member: FamilyMemberType }) {
  const { dayOverviews } = useFamily()
  const dayOverview = dayOverviews[member.name]

  if (!dayOverview) return null

  return (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gun-metal flex flex-col lg:flex-row justify-center align-middle items-center lg:justify-between">
          <div className="min-w-12">
            
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-24 rounded-3xl object-contain border-2 shadow-md shadow-turquoise  aspect-square border-mint cursor-pointer"
                    />
                  ) : (
                    <div className="w-24 rounded-full bg-turquoise flex items-center justify-center border-4 border-mint cursor-pointer">
                      <User className="w-12 h-12 text-mint" />
                    </div>
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
            {/* <span className="absolute top-1/2 -right-1/4 mx-auto bg-gun-metal text-white rounded-full px-2 py-1 text-sm">{member.name}</span> */}
          </div>
          <span className="text-sm text-raisin-black font-light flex flex-col justify-items-center items-center lg:items-end">
            
            <span className="text-center lg:text-right leading-none">{dayOverview.atypicalEvents.length > 0 && (
                <LogoBW className="w-6 h-6 inline-block text-dark-tangerine " />
            )}{dayOverview.summary} for <span className="font-semibold text-xl">{member.name}</span></span>
            {dayOverview.atypicalEvents.length > 0 && (
          <div className="mb-2">
            {dayOverview.atypicalEvents.filter((e,i,a)=>a.findIndex(e2=>(e==e2))==i).map((event, index) => (
                <span key={index} className="ml-3 text-center lg:text-right"><span className="text-dark-tangerine"><AlertCircle className="w-4 h-4 mr-1  inline-block" /></span> {event}</span>
              ))}
            
          </div>
        )}
        <div className="flex flex-row flex-wrap justify-end">
        {dayOverview.hourlySchedule.map((event, index) => {
          return (<div key={index} className="inline-block"><span className=" text-mint text-xs p-1">{format(event.start, `h:mmaaaaa'm'`)}</span><span>{event.activity}</span></div>)
        })}
        </div>
            </span>
        </CardTitle>
           
      </CardHeader>
      <CardContent>
        
        

        {dayOverview.weatherConsiderations.length > 0 && (
          <div className="mb-1">
            <h4 className="text-sm font-semibold text-mint flex items-center">
              <Umbrella className="w-4 h-4 mr-1" /> Weather Considerations:
            </h4>
            <ul className="list-disc list-inside text-sm text-raisin-black">
              {dayOverview.weatherConsiderations.map((consideration, index) => (
                <li key={index}>{consideration}</li>
              ))}
            </ul>
          </div>
        )}

        <Accordion type="single" collapsible className="mt-2">
          <AccordionItem value="details">
            <AccordionTrigger className="text-sm font-semibold text-white bg-mint px-4">
              Full Day Details
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2 shadow  shadow-gun-metal/20">
              <h4 className="text-sm font-semibold text-gun-metal mb-2">Hourly Schedule:</h4>
              <ul className="list-none text-sm text-raisin-black mb-4">
                {dayOverview.hourlySchedule.map((event, index) => {
                    const both_ampm = event.start.getHours() > 12 ? event.end.getHours() > 12 : event.end.getHours() < 12
                    const same_time = event.start.getHours() === event.end.getHours() && event.start.getMinutes() === event.end.getMinutes()
                    return(
                  <li key={index} className="mb-1">
                    <span className="font-semibold">
                        {!same_time && (
                            <>
                            {event.start.getMinutes() > 0 ? format(event.start, `h:mm${both_ampm ? '' : 'aaaaa'}`) : format(event.start, `h${both_ampm ? '' : 'aaaaa'}`)}-
                            </>
                        )}
                    {event.end.getMinutes() > 0 ? format(event.end, `h:mmaaaaa${both_ampm ? '' : ' '}`) : format(event.end, `haaaaa${both_ampm ? '' : ' '}`)}:
                    </span> {event.activity}
                    <span className="text-xs ml-2 text-gun-metal flex items-center">
                      <MapPin className="w-3 h-3 mr-1" /> {event.location}
                    </span>
                    {event.notes && (
                    <span className="text-xs ml-2 text-gun-metal flex items-center">
                      <Car className="w-3 h-3 mr-1" /> {event.notes}
                    </span>
                    )}
                  </li>
                )})}
              </ul>

              {dayOverview.packingList.length > 0 && (
                <>
                  <h4 className="text-sm font-semibold text-gun-metal mb-2">Packing List:</h4>
                  <Checklist items={dayOverview.packingList} />
                </>
              )}

              {dayOverview.otherNotes.length > 0 && (
                <>
                  <h4 className="text-sm font-semibold text-gun-metal mb-2">Other Notes:</h4>
                  <ul className="list-disc list-inside text-sm text-raisin-black">
                    {dayOverview.otherNotes.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

export default function OurDay() {
  const { dayOverviews, family } = useFamily()
  // const dayOverview = dayOverviews[format(activeDate, 'yyyy-MM-dd')]

  // Sort family members: atypical days first, then alphabetically
  const sortedMembers = [...family.members].sort((a, b) => {
    const aTypical = dayOverviews[a.name]?.isTypical
    const bTypical = dayOverviews[b.name]?.isTypical
    if (aTypical === bTypical) {
      return a.name.localeCompare(b.name)
    }
    return aTypical ? 1 : -1
  })

  const no_events = sortedMembers.filter(member => !dayOverviews[member.name]?.hourlySchedule.length && !dayOverviews[member.name]?.atypicalEvents.length)

  return (
    <div className="space-y-6">
      
      {sortedMembers.filter(member => !no_events.includes(member)).map((member) => (
        <FamilyMemberDay key={member.name} member={member} />
      ))}
      {no_events.length > 0 && (
        <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gun-metal flex justify-between">
          {no_events.map(member => (
        <div className="relative" key={`noevents-${member.name}-photo`}>
        
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover border-8 border-mint cursor-pointer"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-turquoise flex items-center justify-center border-4 border-mint cursor-pointer">
                  <User className="w-12 h-12 text-mint" />
                </div>
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
        
        </div>
        ))}
              
            
          </CardTitle>
             
        </CardHeader>
        <CardContent>
        <div className="text-center text-gun-metal">
          <div className="text-xl font-semibold">No events today:</div><div className="text-lg"> {no_events.map(member => member.name).join(', ')}</div>
        </div>

        </CardContent>
      </Card>
      )}
      
    </div>
  )
}
