'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Breadcrumbs } from '@myfood/shared-ui';
import { AdminHeaderProfile } from './AdminHeaderProfile';
import { AuthStateProvider } from './AuthStateProvider';
import { LogoutButton } from './LogoutButton';
import type { SessionWithAuth } from '../lib/auth';

import {
  Home,
  Users,
  Shield,
  KeyRound,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

type MenuItem = {
  label: string;
  href: string;
  icon?: ReactNode;
  // eslint-disable-next-line no-unused-vars
  match?: (path: string | null) => boolean;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const MENU_SECTIONS: MenuSection[] = [
  {
    title: 'เมนูหลัก',
    items: [
      {
        label: 'ภาพรวมระบบ',
        href: '/dashboard',
        icon: <Home size={20} />
      }
    ]
  },
  {
    title: 'จัดการผู้ใช้',
    items: [
      {
        label: 'รายชื่อผู้ใช้',
        href: '/dashboard/users',
        icon: <Users size={20} />,
        match: (path) =>
          path === '/dashboard/users' ||
          (!!path?.startsWith('/dashboard/users/') &&
            !path?.startsWith('/dashboard/users/create'))
      }
    ]
  },
  {
    title: 'จัดการสิทธิ์',
    items: [
      {
        label: 'บทบาทผู้ใช้งาน',
        href: '/dashboard/roles',
        icon: <Shield size={20} />,
        match: (path) =>
          path === '/dashboard/roles' ||
          !!path?.startsWith('/dashboard/roles/')
      },
      {
        label: 'สิทธิ์การใช้งาน',
        href: '/dashboard/permissions',
        icon: <KeyRound size={20} />,
        match: (path) =>
          path === '/dashboard/permissions' ||
          !!path?.startsWith('/dashboard/permissions/')
      }
    ]
  }
];

const breadcrumbLabels = {
  '/dashboard': 'ภาพรวมระบบ',
  '/dashboard/users': 'จัดการผู้ใช้',
  '/dashboard/users/create': 'สร้างผู้ใช้ใหม่',
  '/dashboard/users/[id]': 'โปรไฟล์ผู้ใช้',
  '/dashboard/users/[id]/edit': 'แก้ไขบัญชี',
  '/dashboard/roles': 'บทบาทผู้ใช้งาน',
  '/dashboard/roles/create': 'สร้างบทบาทใหม่',
  '/dashboard/roles/[id]/edit': 'แก้ไขบทบาท',
  '/dashboard/permissions': 'สิทธิ์การใช้งาน',
  '/dashboard/permissions/create': 'สร้างสิทธิ์ใหม่',
  '/dashboard/permissions/[id]/edit': 'แก้ไขสิทธิ์',
  '/dashboard/no-access': 'สิทธิ์ไม่เพียงพอ',
  '/dashboard/login': 'เข้าสู่ระบบแอดมิน',
  '/account-disabled': 'บัญชีถูกระงับ',
  '/reports': 'รายงานประจำสัปดาห์',
  '/users': 'รายชื่อผู้ใช้ POS',
  '/users/[id]/edit': 'แก้ไขผู้ใช้ POS'
};

type DashboardShellProps = {
  children: ReactNode;
  currentUser: SessionWithAuth | null;
  hideSidebar?: boolean;
  hideHeader?: boolean;
};

const isMenuItemActive = (pathname: string | null, item: MenuItem) => {
  if (!pathname) return false;

  if (item.href === '/dashboard') {
    return pathname === '/dashboard';
  }

  if (typeof item.match === 'function') return item.match(pathname);

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
};


import { computeShouldHideLayout } from '../app/layoutUtils';

export function DashboardShell({
  children,
  currentUser,
  hideSidebar: propsHideSidebar = false,
  hideHeader: propsHideHeader = false
}: DashboardShellProps) {

  const pathname = usePathname();
  const shouldHide = computeShouldHideLayout(pathname || '');

  const hideSidebar = propsHideSidebar || shouldHide;
  const hideHeader = propsHideHeader || shouldHide;

  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // ⭐ sidebar compact mode
  const [compact, setCompact] = useState(false);

  const wrapperPadding = hideSidebar
    ? 'lg:pl-0'
    : isSidebarOpen
      ? compact
        ? 'lg:pl-20'
        : 'lg:pl-72'
      : 'lg:pl-0';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Overlay mobile */}
      {!hideSidebar && (
        <div
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
          className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            } fixed inset-0 z-40 bg-slate-900/40 transition-opacity duration-200 ease-in-out lg:hidden`}
        />
      )}

      {/* Sidebar */}
      {!hideSidebar && (
        <aside
          className={`fixed inset-y-0 left-0 z-50
          ${compact ? 'w-20' : 'w-72'}
          max-w-full border-r border-slate-200 bg-white px-4 py-8 shadow-2xl
          transition-all duration-200 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-translate-x-full'}`}
        >

          {/* Toggle Compact */}
          <button
            onClick={() => setCompact(!compact)}
            className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full border bg-white shadow hover:bg-slate-50"
          >
            {compact ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          <nav className="mt-8 flex h-full flex-col justify-between">

            <div className="space-y-8">
              {MENU_SECTIONS.map((section) => (
                <div key={section.title} className="space-y-3">
                  {!compact && (
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      {section.title}
                    </p>
                  )}

                  <div className="space-y-2">
                    {section.items.map((item) => {
                      const isActive = isMenuItemActive(pathname, item);
                      return (
                        <Link
                          key={item.label}
                          href={{ pathname: item.href }}
                          className={`group flex items-center gap-3 rounded-2xl px-3 py-2 transition
                            ${isActive
                              ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/30'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                          <span className="flex h-6 w-6 items-center justify-center">
                            {item.icon}
                          </span>

                          {!compact && (
                            <span className="text-sm font-semibold">{item.label}</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {!compact && (
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">การดูแล</p>
                <p className="text-xs text-slate-500">เมนูสามารถขยายเพิ่มเติมได้ง่าย</p>
              </div>
            )}
          </nav>
        </aside>
      )}

      {/* CONTENT */}
      <div className={`flex min-h-screen flex-col transition-all duration-200 ${wrapperPadding}`}>
        <div className="mx-auto w-full max-w-6xl px-6 py-8">

          {/* Header */}
          {!hideHeader && (
            <>
              <header className="flex flex-col gap-4 border-b border-slate-200 pb-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">MyFood</p>
                      <h1 className="text-3xl font-semibold text-slate-900">ศูนย์ควบคุมแอดมิน</h1>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-center gap-2">
                    <AdminHeaderProfile currentUser={currentUser} />
                    <LogoutButton />
                  </div>
                </div>

              </header>

              <Breadcrumbs
                labelMap={breadcrumbLabels}
                rootLabel="ศูนย์ควบคุมแอดมิน"
                rootHref="/dashboard"
                className="mb-6"
              />
            </>
          )}

          <AuthStateProvider initialUser={currentUser}>
            {children}
          </AuthStateProvider>

        </div>
      </div>
    </div>
  );
}
