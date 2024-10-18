'use client'

import { Chat } from '@/components/Chat'
import FamilyCalendar from '@/components/FamilyCalendar'
import FamilyMember from '@/components/FamilyMember'
import { familyMembers } from '@/data/familymembers'
import { Calendar, CheckSquare, Users, Rss, HelpCircle, MessageCircle } from 'lucide-react'
import { events } from '@/data/events'
import { useFamily } from '@/context'
import OurDay from '@/components/OurDay'
import { format } from 'date-fns'

// For tailwind to pick up the classes
const colSpans = ['col-span-1', 'col-span-2', 'col-span-3', 'lg:col-span-1', 'lg:col-span-2', 'lg:col-span-3', 'md:col-span-1', 'md:col-span-2', 'md:col-span-3', 'sm:col-span-1', 'sm:col-span-2', 'sm:col-span-3']
console.log(colSpans)

export function Dashboard() {
  const { activeDate } = useFamily()
  return (
    <>
      <h1 className="text-3xl font-bold text-gun-metal mb-8">Family Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <DashboardCard title="Family Calendar" icon={Calendar}>
          <FamilyCalendar events={events} />
        </DashboardCard>
        <DashboardCard title={format(activeDate, 'EEEE, MMMM d, yyyy')} icon={CheckSquare} colSpan={2}>
          <OurDay />
        </DashboardCard>
        <DashboardCard title="OhPear Chat" icon={MessageCircle}>
          <Chat />
        </DashboardCard>
        <DashboardCard title="Family Members" icon={Users}>
          {familyMembers.map((familyMember) => (
            <FamilyMember key={familyMember.name} familyMember={familyMember} onEdit={() => {}} />
          ))}
        </DashboardCard>
        <DashboardCard title="Information Feeds" icon={Rss}>
          <p className="text-sm text-raisin-black">View summaries from connected data sources</p>
        </DashboardCard>
        <DashboardCard title="Questions" icon={HelpCircle}>
          <p className="text-sm text-raisin-black">Get clarification on family data</p>
        </DashboardCard>
        
      </div>
    </>
  )
}

function DashboardCard({ title, icon: Icon, colSpan = 1, children }: { title: string; icon: React.ElementType; colSpan?: number; children: React.ReactNode }) {
  return (
    <div className={`bg-turquoise rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 md:col-span-${colSpan-1} lg:col-span-${colSpan}`}>
      <div className="flex items-center mb-4">
        <Icon className="w-8 h-8 text-mint mr-3" />
        <h2 className="text-xl font-semibold text-gun-metal">{title}</h2>
      </div>
      {children}
    </div>
  )
}

export default Dashboard;
