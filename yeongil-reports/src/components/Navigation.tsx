'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navSections = [
  {
    title: 'Operations (Daily/Weekly)',
    items: [
      { name: '01. 일보현황', href: '/operations/01-ilbo' },
      { name: '02. 일일매출수금현황', href: '/operations/02-daily-sales' },
      { name: '03. 재고파악시트', href: '/operations/03-inventory' },
      { name: '04. 장기재고현황', href: '/operations/04-longterm-inventory' },
    ],
  },
  {
    title: 'B2B Reports',
    items: [
      { name: '06. B2B일일매출분석', href: '/b2b/06-daily-analysis' },
      { name: '11. B2B자료', href: '/b2b/11-historical' },
    ],
  },
  {
    title: 'B2C Reports',
    items: [
      { name: '10. B2C회의자료', href: '/b2c/10-meeting' },
    ],
  },
  {
    title: 'Financial/AR',
    items: [
      { name: '05. 판매현황', href: '/financial/05-sales-status' },
      { name: '07. 미거래업체현황', href: '/financial/07-inactive-customers' },
      { name: '08. 장기미수금현황', href: '/financial/08-longterm-ar' },
      { name: '09. 마감회의', href: '/financial/09-closing-meeting' },
    ],
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
      <Link href="/" className="block mb-8">
        <h1 className="text-xl font-bold text-gray-900">영일오엔씨</h1>
        <p className="text-sm text-gray-500">Reports Dashboard</p>
      </Link>

      <div className="space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {section.title}
            </h2>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                      pathname === item.href
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
