'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, BarChart3, LayoutDashboard, LogOut, User, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/kpi-library', label: 'KPI Library' },
  { href: '/executive', label: 'Executive' },
  { href: '/legislative', label: 'Legislative' },
  { href: '/judicial', label: 'Judicial' },
  { href: '/data-sources', label: 'Data Sources' },
  { href: '/methodology', label: 'Methodology' },
]

export function Header() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-navy-600 text-white">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="leading-tight hidden sm:block">
              <div className="text-sm font-bold text-navy-600">Gov KPI Dashboard</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Civic Transparency</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'text-navy-600 bg-navy-50'
                    : 'text-slate-600 hover:text-navy-600 hover:bg-slate-50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: auth */}
          <div className="flex items-center gap-2">
            {status === 'loading' ? (
              <div className="w-20 h-8 bg-slate-100 rounded-lg animate-pulse" />
            ) : session ? (
              <>
                {/* My Dashboard link */}
                <Link
                  href="/dashboard"
                  className={cn(
                    'hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === '/dashboard'
                      ? 'text-navy-600 bg-navy-50'
                      : 'text-slate-600 hover:text-navy-600 hover:bg-slate-50'
                  )}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  My Dashboard
                </Link>

                {/* User avatar menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-50 transition"
                  >
                    {session.user?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={session.user.image}
                        alt={session.user.name ?? ''}
                        className="w-7 h-7 rounded-full border border-slate-200"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-navy-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-navy-600" />
                      </div>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl border border-slate-100 shadow-lg z-20 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {session.user?.name ?? 'User'}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{session.user?.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          My Dashboard
                        </Link>
                        <button
                          onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/' }) }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition border-t border-slate-100"
                        >
                          <LogOut className="w-4 h-4 text-slate-400" />
                          Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="hidden sm:inline-flex text-sm font-medium text-slate-600 hover:text-navy-600 px-3 py-2 rounded-md hover:bg-slate-50 transition"
                >
                  Sign in
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm py-2 px-4 hidden sm:inline-flex">
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'block px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                isActive(link.href)
                  ? 'text-navy-600 bg-navy-50'
                  : 'text-slate-600 hover:text-navy-600 hover:bg-slate-50'
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-navy-600"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  My Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-sm font-medium text-slate-600"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-sm font-semibold text-navy-600 bg-navy-50"
                >
                  Get Started — Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
