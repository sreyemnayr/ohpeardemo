import { FamilyEvent } from '@/data/events'
import { format } from 'date-fns'
import * as Tooltip from '@radix-ui/react-tooltip'

export function EventSummary({ event, size = 'sm', Element = 'li' }: { event: FamilyEvent, size?: 'lg' | 'sm' | 'xs', Element?: React.ElementType}) {
  const both_ampm = event.start.getHours() > 12 ? event.end.getHours() > 12 : event.end.getHours() < 12
  return(
  <Element className={`text-${size === 'lg' ? 'md' : size === 'xs' ? '2xs' : 'xs'} flex ${size === 'xs' ? 'flex-col m-2 align-middle justify-center items-center' : 'flex-row m-0 gap-2'} justify-between `}>
    { size === 'xs' && (
            <span className=" "> {format(event.start, `EEE, MMM d`)}</span>
        )}
    <span className={`flex-grow whitespace-nowrap ${size === 'xs' ? 'text-2xs' : 'text-xs'}`}>
        
      {event.start.getMinutes() > 0 ? format(event.start, `h:mm${both_ampm ? '' : 'aaaaa'}`) : format(event.start, `h${both_ampm ? '' : 'aaaaa'}`)}-{event.end.getMinutes() > 0 ? format(event.end, `h:mmaaaaa${both_ampm ? '' : ' '}`) : format(event.end, `haaaaa${both_ampm ? '' : ' '}`)}
    
    </span>
    
    <span className={`${event?.adjustments?.length ? 'font-semibold' : ''} ${size === 'xs' ? 'font-semibold text-lg' : ''} ${event?.adjustments?.includes("CANCELLED") ? 'line-through' : ''} text-ellipsis overflow-hidden whitespace-nowrap hover:overflow-visible`}> {event.title}
    </span>
    <span>
    {event.familyMembers.map(member => (
      
      <Tooltip.Root key={`${member.name}-${event.title}-${event.start}`}>
        <Tooltip.Trigger asChild>
      <>
        {member.photoUrl ? (
<img
  src={member.photoUrl}
  alt={member.name}
  className={`w-4 h-4 rounded-full object-cover border-0 inline-block ${member.role === 'Parent' ? 'outline outline-1 outline-mint' : 'outline outline-1 outline-sea-buckthorn'}`}
  key={`${member.name}-${event.title}-${event.start}`}
/>
) : (
<span  className={`text-${size === 'lg' ? 'sm' : size === 'xs' ? '2xs' : 'xs'} inline-flex items-center justify-center flex-row ${member.role === 'Parent' ? 'bg-mint' : 'bg-sea-buckthorn'} text-white rounded-full aspect-square px-0.5 py-0.5 mx-0 w-4 h-4`} key={`${member.name}-${event.title}-${event.start}`}>
<span className="text-center" >{member.name.slice(0, 1)}</span>
</span>
)}
<span className="ml-1">{member.name}</span>    
</>
</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className={`bg-gun-metal text-white px-2 py-1 rounded ${size === 'xs' ? 'text-2xs' : 'text-xs'}`}
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
  </Element>
  
  )
}

