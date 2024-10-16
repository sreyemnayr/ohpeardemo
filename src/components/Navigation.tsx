'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Home, Calendar, Users, Rss, MessageSquare } from 'lucide-react'
import LogoBW from './LogoBW'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Family', href: '/family', icon: Users },
    { name: 'Feeds', href: '/feeds', icon: Rss },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
  ]

  return (
    <nav className="bg-gun-metal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center justify-center">
              <LogoBW className="h-8 w-8 text-dark-tangerine mr-2" />
              <span className="text-3xl font-bold text-dark-tangerine font-logo">OhPear!</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-mint hover:text-raisin-black transition-colors duration-200"
                >
                  <item.icon className="inline-block w-5 h-5 mr-1" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-raisin-black hover:bg-mint focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
            >
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-mint hover:text-raisin-black transition-colors duration-200"
              >
                <item.icon className="inline-block w-5 h-5 mr-1" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation;
