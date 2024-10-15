'use client'

import Layout from '../components/Layout'
import Link from 'next/link'
import AddFeedWizard from '@/components/AddFeedWizard'
import { Rss, Wrench, Copy, Plus } from 'lucide-react'
import { useState } from 'react'
import { builtin_feeds, custom_feeds } from '@/data/feeds'


export function Feeds() {
  

  const [isAddFeedWizardOpen, setIsAddFeedWizardOpen] = useState(false);


  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gun-metal mb-8">Information Feeds</h1>
      <h2 className="text-lg font-medium text-gun-metal mb-4"><Rss className="inline w-6 h-6 mr-2" /> Built-in feeds</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {builtin_feeds.map((feed, index) => (
          <div key={index} className="bg-turquoise rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4 max-w-full">
              <div className="flex items-center flex-col justify-center text-center mr-4">
                <feed.Icon className="w-8 h-8 text-mint " />
                <p className="text-xs text-raisin-black">{feed.type}</p>
              </div>
              <div className="flex flex-col justify-center gap-1">
                <h2 className="text-xl font-semibold text-gun-metal">{feed.name}</h2>
                <p className="text-sm text-raisin-black">{feed.description}</p>
                
                <div className="flex justify-end max-w-full">
                <pre className="text-xs text-white bg-mint rounded-md p-2 flex-grow mr-2 truncate text-ellipsis text-nowrap whitespaec-nowrap">{feed.id} <Copy className="inline w-4 h-4 float-right hover:cursor-pointer hover:text-raisin-black" /></pre>
                  <Link
                    href={`/feeds/${feed.id}`}
                    className="px-3 py-2 rounded-md text-xs font-medium text-white bg-gun-metal hover:bg-mint hover:text-raisin-black transition-colors duration-200 shadow-md hover:ring-1 hover:ring-mint"
                >
                  <Wrench className="inline w-5 h-5 " />
                  
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h2 className="text-lg font-medium text-gun-metal mb-4 mt-8"><Rss className="inline w-6 h-6 mr-2" /> Custom feeds</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {custom_feeds.map((feed, index) => (
          <div key={index} className="bg-turquoise rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4 max-w-full">
            <div className="flex items-center flex-col justify-center text-center mr-4">
              <feed.Icon className="w-8 h-8 text-mint " />
              <p className="text-xs text-raisin-black">{feed.type}</p>
            </div>
            <div className="flex flex-col justify-center gap-1 w-3/4">
              <h2 className="text-xl font-semibold text-gun-metal">{feed.name}</h2>
              <p className="text-sm text-raisin-black">{feed.description}</p>
              
              <div className="flex justify-end max-w-full">
              <pre className="text-xs text-white bg-mint rounded-md p-2 flex-grow mr-2 truncate text-ellipsis">{feed.id} </pre>
              
                <Link
                  href={`/feeds/${encodeURIComponent(feed.id)}`}
                  className="px-2 py-2 rounded-md text-xs font-medium text-white bg-gun-metal hover:bg-mint hover:text-raisin-black transition-colors duration-200 shadow-md hover:ring-1 hover:ring-mint"
              >
                <Wrench className="inline w-5 h-5 " />
                
                </Link>
              </div>
            </div>
          </div>
        </div>
        ))}
        <div className="flex justify-center items-center">
        <div onClick={() => setIsAddFeedWizardOpen(true)} className="px-3 py-2 rounded-md text-2xl font-medium text-white bg-gun-metal hover:bg-mint hover:text-raisin-black transition-colors duration-200 shadow-md hover:ring-1 hover:ring-mint h-12">
          <Plus className="inline w-6 h-6" /> Add new feed
        </div>
        
        </div>
      </div>
      <AddFeedWizard isOpen={isAddFeedWizardOpen} onClose={() => setIsAddFeedWizardOpen(false)} />
    </Layout>
  )
}

export default Feeds;