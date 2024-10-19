import React, { useState } from 'react'
import { Dialog, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { X, Mail, Calendar, Globe, Camera } from 'lucide-react'

import { 
    SiGmail as GmailIcon,
    SiGoogledrive as GoogleDriveIcon
} from '@icons-pack/react-simple-icons'

type FeedType = 'email' | 'calendar' | 'sms' | 'voice' | 'url' | 'photo' | 'gmail' | 'google-drive'

const feedTypes: { type: FeedType; label: string; icon: React.ElementType }[] = [
  { type: 'gmail', label: 'Gmail Account', icon: GmailIcon },
  { type: 'google-drive', label: 'Google Drive Folder', icon: GoogleDriveIcon },

  { type: 'email', label: 'Email Account', icon: Mail },
  { type: 'calendar', label: 'Calendar Subscription', icon: Calendar },
  { type: 'url', label: 'Website', icon: Globe },
  { type: 'photo', label: 'Photo Share', icon: Camera },
]

export default function AddFeedWizard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState<FeedType | null>(null)
  const [feedDetails, setFeedDetails] = useState({
    name: '',
    address: '',
    authToken: '',
  })

  const handleSelectType = (type: FeedType) => {
    setSelectedType(type)
    setStep(2)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Submitting feed:', { type: selectedType, ...feedDetails })
    onClose()
    // Reset the form
    setStep(1)
    setSelectedType(null)
    setFeedDetails({ name: '', address: '', authToken: '' })
  }

  const handleGoogleAuth = () => {
    // In a real application, you would initiate the Google OAuth flow here
    // console.log('Initiating Google Auth')
    // After successful authentication, you would receive an access token
    // For this example, we'll simulate receiving a token
    setFeedDetails({ ...feedDetails, authToken: 'simulated-google-auth-token' })
  }

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
        <div className="min-h-screen px-4 text-center">
          <TransitionChild
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-30" />
          </TransitionChild>

          <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

          <TransitionChild
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gun-metal">
                Add New Feed
              </DialogTitle>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-raisin-black hover:text-gun-metal"
              >
                <X className="w-5 h-5" />
              </button>

              {step === 1 && (
                <div className="mt-4">
                  <p className="text-sm text-raisin-black mb-4">Select a feed type:</p>
                  <div className="grid grid-cols-2 gap-4">
                    {feedTypes.map((feed) => (
                      <button
                        key={feed.type}
                        onClick={() => handleSelectType(feed.type)}
                        className="flex flex-col items-center justify-center p-4 border border-turquoise rounded-lg hover:bg-turquoise transition-colors duration-200"
                      >
                        <feed.icon className="w-8 h-8 text-mint mb-2" />
                        <span className="text-sm text-gun-metal">{feed.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && selectedType && (
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gun-metal">
                        Feed Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={feedDetails.name}
                        onChange={(e) => setFeedDetails({ ...feedDetails, name: e.target.value })}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-mint focus:border-mint sm:text-sm"
                        required
                      />
                    </div>
                    {selectedType !== 'gmail' && (
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gun-metal">
                          {selectedType === 'email' ? 'Email Address' : 
                           selectedType === 'calendar' ? 'Calendar URL' : 
                           selectedType === 'sms' ? 'Phone Number' : 
                           selectedType === 'voice' ? 'Phone Number' : 
                           selectedType === 'url' ? 'Website URL' : 
                           'Photo Share URL'}
                        </label>
                        <input
                          type={selectedType === 'email' ? 'email' : 'text'}
                          id="address"
                          value={feedDetails.address}
                          onChange={(e) => setFeedDetails({ ...feedDetails, address: e.target.value })}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-mint focus:border-mint sm:text-sm"
                          required
                        />
                      </div>
                    )}
                    {selectedType === 'gmail' ? (
                      <div>
                        <button
                          type="button"
                          onClick={handleGoogleAuth}
                          className="w-full px-4 py-2 text-sm font-medium text-white bg-mint border border-transparent rounded-md hover:bg-dark-tangerine focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mint"
                        >
                          Authenticate with Google
                        </button>
                        {feedDetails.authToken && (
                          <p className="mt-2 text-sm text-green-600">Google account authenticated successfully!</p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <label htmlFor="authToken" className="block text-sm font-medium text-gun-metal">
                          Authentication Token (if required)
                        </label>
                        <input
                          type="text"
                          id="authToken"
                          value={feedDetails.authToken}
                          onChange={(e) => setFeedDetails({ ...feedDetails, authToken: e.target.value })}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-mint focus:border-mint sm:text-sm"
                        />
                      </div>
                    )}
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 text-sm font-medium text-gun-metal bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mint"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-mint border border-transparent rounded-md hover:bg-dark-tangerine focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mint"
                    >
                      Add Feed
                    </button>
                  </div>
                </form>
              )}
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}