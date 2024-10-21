export type PhoneType = {
    number: string
    type: 'Mobile' | 'Home' | 'Work'
    is_primary: boolean
    can_text: boolean
    can_call: boolean
    provider: string
    is_verified: boolean
  
  }
  
  export type EmailType = {
    address: string
    is_primary: boolean
    is_verified: boolean
  }
  
  export type SocialPlatform = 'Facebook' | 'Instagram' | 'Twitter' | 'LinkedIn' | 'Snapchat' | 'TikTok' | 'GroupMe' | 'WhatsApp' | 'Signal' | 'Telegram'
  
  export type SocialType = {
    platform: SocialPlatform
    handle: string
    auth_token?: string
    auth_secret?: string
    auth_expires?: Date
    authenticated_date?: Date
  }
  
  export type ContactType = {
    phones: PhoneType[]
    emails: EmailType[]
    socials: SocialType[]
    photoUrl?: string
  }
  
  export type PersonType = {
    name: string
  }
  
  export type ChildDataType = {
    grade: number
    age: number
    birthdate: Date
    school: string
    activities: string[]
  }
  
  export type FamilyMemberType = {
      name: string
      role: 'Child' | 'Parent' | 'Guardian' | 'Caregiver'
      grade?: number
      age?: number
      photoUrl?: string
      school?: string
      activities: string[]
    }
  
  export type FamilyType = {
    members: FamilyMemberType[]
    activities: string[]
  }
  
export type FamilyEvent = {
    id: string
    start: Date
    end: Date
    title: string
    familyMembers: FamilyMemberType[]
    wholeFamily: boolean
    location?: string
    transporting_to?: FamilyMemberType
    transporting_from?: FamilyMemberType
    adjustments?: string[]
    special?: boolean
}

// Define the structure of packingLists
export type PackingListItem = {
    default: string[]
    [key: string]: string[] // For member-specific items
}
  
export type PackingLists = {
    [key: string]: PackingListItem
}


export type DayOverview = {
    isTypical: boolean
    summary: string
    hourlySchedule: { start: Date; end: Date; activity: string; location?: string; notes?: string }[]
    packingList: string[]
    otherNotes: string[]
    atypicalEvents: string[]
    weatherConsiderations: string[]
  }
  
  export type Message = {
    text?: string
    Element?: React.ReactNode
    sender: 'user' | 'assistant' | 'update'
    command?: ParsedTag
  }
  
  export type Weather = {
    precipitation?: "RAIN" | "SNOW" | "SLEET" | "HAIL" | "NONE"
    temperature?: number
  }


  export interface ParsedTag {
    name: string;
    params: Record<string, string>;
    content: string;
  }
  
  export interface ParseResult {
    tags: ParsedTag[];
    cleanedString: string;
  }
  
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
  }


export type BotContext = "chat" | "email"

type RequiredDefault = {
    default: string[]
}

type OptionalContexts = Partial<Record<BotContext, string[]>>

type ContextRecord = RequiredDefault & OptionalContexts

export type SystemParts = {
    role: ContextRecord
    personality: ContextRecord
    expectations: ContextRecord
    responses: ContextRecord
    special_commands: ContextRecord
    example_commands: ContextRecord
}