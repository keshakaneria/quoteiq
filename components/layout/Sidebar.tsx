'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Building2,
  AlertTriangle,
  BarChart3,
  MessageSquare,
  Trophy,
  Zap,
} from 'lucide-react';

const RFX_ID = 'rfx-001';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: <LayoutDashboard size={15} /> },
  { label: 'RFx Details', href: `/rfx/${RFX_ID}`, icon: <FileText size={15} /> },
  { label: 'Vendor Responses', href: `/rfx/${RFX_ID}/vendors`, icon: <Building2 size={15} /> },
  { label: 'Exceptions', href: `/rfx/${RFX_ID}/exceptions`, icon: <AlertTriangle size={15} />, badge: 18 },
  { label: 'Comparison', href: `/rfx/${RFX_ID}/comparison`, icon: <BarChart3 size={15} /> },
  { label: 'AI Analyst', href: `/rfx/${RFX_ID}/analyst`, icon: <MessageSquare size={15} /> },
  { label: 'Award Scenarios', href: `/rfx/${RFX_ID}/award`, icon: <Trophy size={15} /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '18px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: 7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Zap size={14} color="#0f1117" fill="#0f1117" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--foreground)' }}>QuoteIQ</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>AI Procurement</div>
          </div>
        </div>
      </div>

      {/* RFx context */}
      <div
        style={{
          padding: '10px 14px',
          background: 'rgba(245,158,11,0.06)',
          borderBottom: '1px solid var(--border)',
          margin: '10px 10px 0',
          borderRadius: 8,
        }}
      >
        <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active RFx</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground)', lineHeight: 1.3 }}>
          Corrugated Packaging Annual Sourcing
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>30 lines · 5 vendors</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', overflow: 'auto' }}>
        <div className="section-title" style={{ paddingLeft: 8 }}>
          Navigation
        </div>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              padding: '8px 10px',
              borderRadius: 7,
              marginBottom: 2,
              fontSize: 13,
              fontWeight: isActive(item.href) ? 600 : 400,
              color: isActive(item.href) ? 'var(--foreground)' : 'var(--muted)',
              background: isActive(item.href) ? 'rgba(245,158,11,0.12)' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.12s',
              position: 'relative',
            }}
          >
            <span style={{ color: isActive(item.href) ? 'var(--accent)' : 'var(--muted)' }}>
              {item.icon}
            </span>
            {item.label}
            {item.badge && (
              <span
                style={{
                  marginLeft: 'auto',
                  background: 'rgba(239,68,68,0.2)',
                  color: '#ef4444',
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: 999,
                }}
              >
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '12px 14px',
          borderTop: '1px solid var(--border)',
          fontSize: 11,
          color: 'var(--muted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#10b981',
              display: 'inline-block',
            }}
          />
          Demo mode · All data seeded
        </div>
      </div>
    </aside>
  );
}
