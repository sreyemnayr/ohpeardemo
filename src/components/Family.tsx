'use client'

import Layout from '../components/Layout'
import { User } from 'lucide-react'

export function Family() {
  const familyMembers = [
    { name: 'Parent 1', role: 'Parent' },
    { name: 'Parent 2', role: 'Parent' },
    { name: 'Child 1', role: 'Child' },
    { name: 'Child 2', role: 'Child' },
  ]

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gun-metal mb-8">Family Members</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {familyMembers.map((member, index) => (
          <div key={index} className="bg-turquoise rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <User className="w-8 h-8 text-mint mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gun-metal">{member.name}</h2>
                <p className="text-sm text-raisin-black">{member.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default Family;