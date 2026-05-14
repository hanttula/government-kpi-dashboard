import Link from 'next/link'
import { BarChart3, ExternalLink } from 'lucide-react'

const footerLinks = {
  Branches: [
    { href: '/executive', label: 'Executive Branch' },
    { href: '/legislative', label: 'Legislative Branch' },
    { href: '/judicial', label: 'Judicial Branch' },
  ],
  Resources: [
    { href: '/kpi-library', label: 'KPI Library' },
    { href: '/data-sources', label: 'Data Sources' },
    { href: '/methodology', label: 'Methodology' },
    { href: '/contact', label: 'Request / Contact' },
  ],
  'Public Data APIs': [
    { href: 'https://api.congress.gov', label: 'Congress.gov API', external: true },
    { href: 'https://api.usaspending.gov', label: 'USAspending.gov API', external: true },
    { href: 'https://fred.stlouisfed.org', label: 'FRED (St. Louis Fed)', external: true },
    { href: 'https://www.bls.gov/developers/', label: 'BLS Public Data API', external: true },
    { href: 'https://www.uscourts.gov/statistics-reports', label: 'U.S. Courts Statistics', external: true },
  ],
}

export function Footer() {
  return (
    <footer className="bg-navy-600 text-navy-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-white">Gov KPI Dashboard</span>
            </div>
            <p className="text-xs text-navy-300 leading-relaxed mb-4">
              Aggregating publicly available government data into understandable dashboards.
              Neutral, nonpartisan, and educational.
            </p>
            <p className="text-[11px] text-navy-400">
              All data sourced from official federal agencies and public APIs.
              This site does not produce original research.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-300 mb-3">
                {group}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-navy-200 hover:text-white transition-colors flex items-center gap-1"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-xs text-navy-200 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-navy-500 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-navy-400">
            © {new Date().getFullYear()} Government KPI Dashboard. Data presented for informational purposes only.
            Not affiliated with any government agency.
          </p>
          <p className="text-[11px] text-navy-400">
            Built with publicly available federal data. Open source.
          </p>
        </div>
      </div>
    </footer>
  )
}
