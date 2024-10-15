import React from 'react'
import { User, Pencil } from 'lucide-react'
import { FamilyMemberType } from '@/data/familymembers'

export default function FamilyMember({
  familyMember,
  onEdit    
}: { familyMember: FamilyMemberType, onEdit: () => void }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
      <div className="relative mb-4">
        {familyMember.photoUrl ? (
          <img
            src={familyMember.photoUrl}
            alt={familyMember.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-mint"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-turquoise flex items-center justify-center border-4 border-mint">
            <User className="w-12 h-12 text-mint" />
          </div>
        )}
        <span className="absolute bottom-0 right-0 bg-dark-tangerine text-white text-xs font-bold px-2 py-1 rounded-full">
          {familyMember.role}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-gun-metal mb-2">{familyMember.name}</h3>
      {familyMember.school && (
        <p className="text-sm text-raisin-black mb-2">
          School: {familyMember.school}
        </p>
      )}
      {familyMember.activities && familyMember.activities.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {familyMember.activities.map((activity, index) => (
            <span
              key={index}
              className="bg-sea-buckthorn text-gun-metal text-xs font-medium px-2 py-1 rounded-full"
            >
              {activity}
            </span>
          ))}
        </div>
      )}
      <button
        onClick={onEdit}
        className="flex items-center justify-center px-4 py-2 bg-mint text-white rounded-md hover:bg-dark-tangerine transition-colors duration-200"
      >
        <Pencil className="w-4 h-4 mr-2" />
        Edit Profile
      </button>
    </div>
  )
}