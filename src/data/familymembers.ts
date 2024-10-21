import { FamilyMemberType, FamilyType } from "@/types";
export const familyMembers = [
    { name: 'Dad', role: 'Parent', activities: ['PTA', 'Soccer'], photoUrl: '/Bandit.png'},
    { name: 'Mom', role: 'Parent', activities: ['PTA', 'Yoga'], photoUrl: '/Chilli.png'},
    { name: 'Bluey', role: 'Child', grade: 3, age: 8, school: 'St. George\'s Episcopal School', activities: ['Cheerleading', 'Aikido', 'Ballet', 'Counseling', 'Pelicans', 'Volleyball'], photoUrl: '/Bluey.png'},
    { name: 'Bingo', role: 'Child', grade: -4, age: 4, school: 'St. George\'s Episcopal School', activities: ['Ballet', 'Soccer'], photoUrl: '/Bingo.png' },
    { name: 'Muffin', role: 'Child', grade: -2, age: 2, activities: ['Pelicans'], photoUrl: '/Muffin.png' },
    { name: 'Uncle Rad', role: 'Caregiver', activities: [], photoUrl: '/UncleRad.png'}
] as FamilyMemberType[]

export const family = {
  members: familyMembers,
  activities: ['Hope House']
} as FamilyType