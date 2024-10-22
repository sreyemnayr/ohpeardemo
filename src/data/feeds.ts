import { LucideIcon } from "lucide-react";
import { Mailbox, MessageCircle, Calendar, Mic } from "lucide-react";

export type FeedType = 'Email' | 'SMS' | 'Voice' | 'Calendar' | 'Contacts' | 'Social' | 'Integration'

type FeedOptions = {
  type: 'input' | 'checkbox' | 'select' | 'textarea' | 'number' | 'date'
  label: string
  description: string
  default?: string | boolean | number | Date
  options?: string[]
  required?: boolean
}

type IntegrationSourceType = 'GroupMe' | 'Slack' | 'Zoom' | 'Google Calendar' | 'GMail' | 'Google Tasks' | 'Google Contacts' | 'Google Drive' | 'Google Photos' | 'Google Calendar' | 'Google Tasks'

type IntegrationType = {
  source: IntegrationSourceType
  options?: FeedOptions[]

}

type Feed = {
    name: string,
    type: FeedType,
    description: string,
    id: string,
    Icon: LucideIcon
    integration?: IntegrationType
    options?: FeedOptions[]
  }


export const builtin_feeds: Feed[] = [
    { name: 'Family E-Mail Sink', type: 'Email', description: 'Send e-mails to this address to tell OhPear about their contents.', id: 'n1go7@tellohpear.com', Icon: Mailbox },
    
    { name: 'SMS Sink', type: 'SMS', description: 'Send SMS messages to this address to tell OhPear about their contents.', id: 'sms:+1 504 504 5272', Icon: MessageCircle },

    { name: 'Voice Call Transcription', type: 'Voice', description: 'Leave a voice message to tell OhPear something.', id: 'voice:+1 504 504 5272', Icon: Mic },
  ]

export const custom_feeds: Feed[] = [
    { name: 'St. George\'s Episcopal School Calendar', type: 'Calendar', description: 'Connect your calendar to sync your events.', id: 'https://www.stgnola.org/cf_calendar/feed.cfm?type=ical&feedID=1792D56B78604A28A71B7D87FBE99D6E', Icon: Calendar },
  ]