import { LucideIcon } from "lucide-react";
import { Mailbox, MessageCircle, Calendar, Mic } from "lucide-react";

type Feed = {
    name: string,
    type: string,
    description: string,
    id: string,
    Icon: LucideIcon
  }

export const builtin_feeds: Feed[] = [
    { name: 'Family E-Mail Sink', type: 'Email', description: 'Send e-mails to this address to tell OhPear about their contents.', id: 'n1go7@tellohpear.com', Icon: Mailbox },
    
    { name: 'SMS Sink', type: 'SMS', description: 'Send SMS messages to this address to tell OhPear about their contents.', id: '+15041234567', Icon: MessageCircle },
    { name: 'Voice Call Transcription', type: 'Voice', description: 'Connect your voice call transcription service to sync your voicemails.', id: '+15041234567', Icon: Mic },
  ]

export const custom_feeds: Feed[] = [
    { name: 'St. George\'s Episcopal School Calendar', type: 'Calendar', description: 'Connect your calendar to sync your events.', id: 'https://www.stgnola.org/cf_calendar/feed.cfm?type=ical&feedID=1792D56B78604A28A71B7D87FBE99D6E', Icon: Calendar },
  ]