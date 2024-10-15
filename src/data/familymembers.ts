export type FamilyMemberType = {
    name: string
    role: 'Child' | 'Parent' | 'Guardian' | 'Grandparent'
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
] as FamilyMemberType[]

export const family = {
  members: familyMembers,
  activities: ['Hope House']
}