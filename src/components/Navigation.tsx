'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, Calendar, Users, Rss, MessageSquare } from 'lucide-react'
import LogoColor from './LogoColor'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

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
            <Link href="/dashboard" className="relative flex-shrink-0 flex items-center justify-center group text-dark-tangerine">
              <LogoColor className="h-8 w-8 mr-2 opacity-100 absolute top-0 left-0 group-hover:h-10 group-hover:w-10  group-hover:-top-1  group-hover:-left-1 transition-all duration-300" />
              <span className="font-logo ml-9 ">
                <span className="text-3xl group-hover:text-4xl font-bold  group-hover:text-sea-buckthorn transition-all duration-300 delay-100">Oh</span><span className="text-3xl group-hover:text-4xl font-bold  group-hover:text-sea-buckthorn transition-all delay-200 duration-300">Pear</span><span className="text-3xl group-hover:text-4xl font-bold  group-hover:text-sea-buckthorn transition-all delay-300 duration-300">!</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                    ${pathname === item.href
                      ? 'text-sea-buckthorn'
                      : 'text-white hover:bg-mint hover:text-raisin-black'
                    }`}
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
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                  ${pathname === item.href
                    ? 'text-sea-buckthorn'
                    : 'text-white hover:bg-mint hover:text-raisin-black'
                  }`}
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
