import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Umbrella, CheckCircle, MapPin, Car, User } from 'lucide-react'
import { FamilyMemberType } from '@/data/familymembers'
import { useFamily } from '@/context'
import { format } from 'date-fns'

function FamilyMemberDay({ member }: { member: FamilyMemberType }) {
  const { dayOverviews } = useFamily()
  const dayOverview = dayOverviews[member.name]

  if (!dayOverview) return null

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gun-metal flex justify-between">
            <div className="relative">
        {member.photoUrl ? (
          <img
            src={member.photoUrl}
            alt={member.name}
            className="w-24 h-24 rounded-full object-cover border-8 border-mint"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-turquoise flex items-center justify-center border-4 border-mint">
            <User className="w-12 h-12 text-mint" />
          </div>
        )}
          <span className="absolute -top-2 -right-4 mx-auto bg-gun-metal text-white rounded-full px-2 py-1 text-sm">{member.name}</span>
          </div>
          <span className="text-sm text-raisin-black font-light flex flex-col justify-items-center items-end">
            
            <span>{dayOverview.summary}</span>
            {dayOverview.atypicalEvents.length > 0 && (
          <div className="mb-2">
            {dayOverview.atypicalEvents.map((event, index) => (
                <span key={index} className="ml-3 text-right"><span className="text-dark-tangerine"><AlertCircle className="w-4 h-4 mr-1  inline-block" /></span> {event}</span>
              ))}
            
          </div>
        )}
            </span>
        </CardTitle>
           
      </CardHeader>
      <CardContent>
        
        

        {dayOverview.weatherConsiderations.length > 0 && (
          <div className="mb-2">
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

        <Accordion type="single" collapsible className="mt-4">
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
                  <ul className="list-none flex flex-wrap items-center justify-center text-sm text-raisin-black mb-4" >
                    {dayOverview.packingList.map((item, index) => (
                      <li key={index} className="mr-4"><CheckCircle className="w-3 h-3 mr-1 inline-block" />{item}</li>
                    ))}
                  </ul>
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
  const { family, dayOverviews } = useFamily()
  
  // Sort family members: atypical days first, then alphabetically
  const sortedMembers = [...family.members].sort((a, b) => {
    const aTypical = dayOverviews[a.name]?.isTypical
    const bTypical = dayOverviews[b.name]?.isTypical
    if (aTypical === bTypical) {
      return a.name.localeCompare(b.name)
    }
    return aTypical ? 1 : -1
  })

  return (
    <div className="space-y-6">
      
      {sortedMembers.map((member) => (
        <FamilyMemberDay key={member.name} member={member} />
      ))}
    </div>
  )
}
