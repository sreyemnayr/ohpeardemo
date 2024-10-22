'use client'

import { Chat } from '@/components/ChatSDK'
import FamilyCalendar from '@/components/FamilyCalendar'
import FamilyMember from '@/components/FamilyMember'
import { familyMembers } from '@/data/familymembers'
import { Calendar, CheckSquare, Users, Rss, HelpCircle, MessageCircle, CloudRain, Snowflake, Sun, CloudSnow, CloudHail, CloudSunRain } from 'lucide-react'
// import { events } from '@/data/events'
import { useFamily } from '@/context'
import { Weather } from '@/types'
import OurDay from '@/components/OurDay'
import { format } from 'date-fns'

// For tailwind to pick up the classes

const WeatherIcon = ({ precipitation }: { precipitation: Weather['precipitation'] }) => {
  if (precipitation === "RAIN") return <CloudRain />
  if (precipitation === "SNOW") return <Snowflake />
  if (precipitation === "SLEET") return <CloudSnow />
  if (precipitation === "HAIL") return <CloudHail />
  if (precipitation === "NONE") return <Sun />
  return <CloudSunRain className="opacity-20" />
}

const WeatherInfo = ({ weather }: { weather: Weather }) => {
  return (
    <div className="flex flex-row items-center text-mint border border-mint rounded-lg p-1 px-2">
      <span className="mr-2 text-lg font-semibold">{weather.temperature ? `${weather.temperature}°F` : '??'}</span>
      <WeatherIcon precipitation={weather.precipitation} />
    </div>
  )
}

export function Dashboard() {
  const { activeDate, weather } = useFamily()
  
  return (
    <>
      <h1 className="text-3xl font-bold text-gun-metal mb-8">Family Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <DashboardCard title="Family Calendar" icon={Calendar}>
          <FamilyCalendar />
        </DashboardCard>
        <DashboardCard title={format(activeDate, 'EEEE, MMMM d, yyyy')} subtitle={<WeatherInfo weather={weather} />} icon={CheckSquare} colSpan={2}>
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

function DashboardCard({ title, subtitle, icon: Icon, colSpan = 1, children }: { title: string; subtitle?: React.ReactNode; icon: React.ElementType; colSpan?: number; children: React.ReactNode }) {
  return (
    <div className={`bg-turquoise rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 md:col-span-${colSpan-1} lg:col-span-${colSpan}`}>
      <div className="flex flex-row justify-between w-full">
        <div className="flex items-center mb-4">
          <Icon className="w-8 h-8 text-mint mr-3" />
          <h2 className="text-xl font-semibold text-gun-metal">{title}</h2>
        </div>
        {subtitle && (
          <div className="text-sm text-raisin-black">{subtitle}</div>
        )}
      </div>
      {children}
    </div>
  )
}

export default Dashboard;
