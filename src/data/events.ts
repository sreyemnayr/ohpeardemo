import { FamilyMemberType, family } from './familymembers'
import { 
    startOfToday,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    setHours,
    getDay,
    setMinutes,
    isSameDay,
 } from 'date-fns'

export type FamilyEvent = {
    start: Date
    end: Date
    title: string
    familyMembers: FamilyMemberType[]
    wholeFamily: boolean
    location: string
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

const today = startOfToday()
const dayOfWeek = getDay(today)
const start = startOfMonth(today)
const end = endOfMonth(today)

const offset = dayOfWeek >= 4 ? -2 : 2

const daysInMonth = eachDayOfInterval({ start: start, end: end })

const events: FamilyEvent[] = []

const bluey = family.members.find(member => member.name === 'Bluey') as FamilyMemberType
const bingo = family.members.find(member => member.name === 'Bingo') as FamilyMemberType
const muffin = family.members.find(member => member.name === 'Muffin') as FamilyMemberType
const dad = family.members.find(member => member.name === 'Dad') as FamilyMemberType
const mom = family.members.find(member => member.name === 'Mom') as FamilyMemberType

for (const day of daysInMonth) {
    const is_today = isSameDay(day, today)
    const is_weekday = getDay(day) >= 1 && getDay(day) <= 5
    // const is_weekend = getDay(day) === 0 || getDay(day) === 6

    const random_special = Math.random() < 0.15

    
    if (is_weekday) {
        events.push({
            start: setHours(day, 8),
            end: setHours(day, 15),
            title: "School",
            familyMembers: [bluey, bingo, muffin],
            wholeFamily: false,
            location: "923 Napoleon Ave.",
            transporting_to: dad,
            transporting_from: dad,
            adjustments: random_special ? ["CANCELLED"] : undefined
        })
    }

    if (getDay(day) === dayOfWeek) {
        events.push({
            start: setHours(day, 16),
            end: setHours(day, 17),
            title: "Cheerleading Practice",
            familyMembers: [bluey],
            wholeFamily: false,
            location: "923 Napoleon Ave.",
            transporting_from: mom,
        })
        events.push({
            start: setHours(day, 18),
            end: setHours(day, 19),
            title: "Ballet Class",
            familyMembers: [bluey],
            wholeFamily: false,
            location: "1001 Harrison Ave.",
            adjustments: is_today ? ['CANCELLED'] : undefined,
            transporting_to: mom,
            transporting_from: dad
        })
    }
    if (getDay(day) === dayOfWeek + offset) {
        events.push({
            start: setHours(day, 16),
            end: setHours(day, 17),
            title: "Cheerleading Practice",
            familyMembers: [bluey],
            wholeFamily: false,
            location: "923 Napoleon Ave.",
            transporting_from: mom
        })
        events.push({
            start: setHours(day, 18),
            end: setHours(day, 19),
            title: "Ballet Class",
            familyMembers: [bluey],
            wholeFamily: false,
            location: "1001 Harrison Ave.",
            transporting_to: mom,
            transporting_from: mom
        })
        events.push({
            start: setMinutes(setHours(day, 16), 15),
            end: setHours(day, 17),
            title: "Ballet Class",
            familyMembers: [bingo],
            wholeFamily: false,
            location: "1001 Harrison Ave.",
            transporting_to: dad,
            transporting_from: dad
        })
    }
    if (getDay(day) === dayOfWeek + (offset/2)) {
        events.push({
            start: setMinutes(setHours(day, 16), 15),
            end: setMinutes(setHours(day, 18), 15),
            title: "Aftercare",
            familyMembers: [bluey, muffin, bingo],
            wholeFamily: false,
            location: "923 Napoleon Ave.",
            transporting_from: dad
        })
    }
    if (getDay(day) === 0) {
        events.push({
            start: setHours(day, 9),
            end: setHours(day, 11),
            title: "Hope House",
            familyMembers: family.members,
            wholeFamily: true,
            location: "916 St Andrew St.",
            transporting_to: mom,
            transporting_from: mom
        })
    }
}

const packingLists: PackingLists = {
    "Cheerleading Practice": { 
        "default": [
            "Tennis Shoes", "Shorts", "Shirt", "Extra Snack", "Hair Tie"] 
        },
    "Ballet Class": {
        "default": [
            "Ballet Shoes", "Leotard", "Ballet Skirt", "Ballet Tights"
        ],
        "Bluey": [
            "Hair Tie",
        ],
        "Bingo": [
            "Sticker Book",
        ]
    },
    "Aftercare": {
        "default": [],
    },
    "Hope House": {
        "default": [],
    },
    "School": {
        "default": ["Lunch", "Water Bottle", "Backpack"],
        "Bluey": ["Binder", "Snack"],
        "Muffin": ["Diaper Bag", "Extra Clothes"],
        "RAIN" : ["Umbrella"]
    }
}

export { events, packingLists }

// export const events: FamilyEvent[] = [
//     { date: new Date(2024, 10-1, 12), title: "Sarah's Dance Recital" },
//     { date: new Date(2024, 10-1, 18), title: "Family Movie Night" },
//     { date: new Date(2024, 10-1, 20), title: "Dad's Birthday" },
//     { date: new Date(2024, 10-1, 25), title: "Summer Vacation Starts" },
//   ]
