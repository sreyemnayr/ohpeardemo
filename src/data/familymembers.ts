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

export const familyMembers = [
    { name: 'Dad', role: 'Parent', activities: ['PTA', 'Soccer'], photoUrl: '/Bandit.png'},
    { name: 'Mom', role: 'Parent', activities: ['PTA', 'Yoga'], photoUrl: '/Chilli.png'},
    { name: 'Bluey', role: 'Child', grade: 3, age: 8, school: 'St. George\'s Episcopal School', activities: ['Cheerleading', 'Aikido', 'Ballet', 'Counseling', 'Pelicans'], photoUrl: '/Bluey.png'},
    { name: 'Bingo', role: 'Child', grade: -4, age: 4, school: 'St. George\'s Episcopal School', activities: ['Ballet', 'Soccer'], photoUrl: '/Bingo.png' },
    { name: 'Muffin', role: 'Child', grade: -2, age: 2, activities: ['Pelicans'], photoUrl: '/Muffin.png' },
    { name: 'Uncle Rad', role: 'Caregiver', activities: [], photoUrl: '/UncleRad.png'}
] as FamilyMemberType[]

export const family = {
  members: familyMembers,
  activities: ['Hope House']
}