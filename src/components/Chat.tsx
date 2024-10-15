'use client'

import Layout from '../components/Layout'
import { useState } from 'react'
import { Send } from 'lucide-react'

export function Chat() {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle message submission here
    console.log('Message submitted:', message)
    setMessage('')
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gun-metal mb-8">Family Chat</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="h-96 bg-turquoise rounded-lg mb-4 p-4 overflow-y-auto">
          {/* Chat messages will be displayed here */}
        </div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow px-4 py-2 border border-gun-metal rounded-l-lg focus:outline-none focus:ring-2 focus:ring-mint"
          />
          <button
            type="submit"
            className="bg-mint text-white px-4 py-2 rounded-r-lg hover:bg-dark-tangerine transition-colors duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default Chat;
