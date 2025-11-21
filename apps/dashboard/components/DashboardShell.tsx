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

type MenuItem = {
  label: string;
  href: string;
  description: string;
  // eslint-disable-next-line no-unused-vars
  match?: (path: string | null) => boolean;
};

type MenuSection = {
  title: string;
  description: string;
  items: MenuItem[];
};

const MENU_SECTIONS: MenuSection[] = [
  {
    title: 'เมนูหลัก',
    description: 'เข้าถึงจุดเริ่มต้นของแดชบอร์ดและแจ้งเตือนหลัก',
    items: [
      { label: 'ภาพรวมระบบ', href: '/dashboard', description: 'ดูภาพรวมการขาย แจ้งเตือน และกิจกรรมล่าสุด' }
    ]
  },
  {
    title: 'จัดการผู้ใช้',
    description: 'ควบคุมบัญชี POS และสิทธิ์',
    items: [
      {
        label: 'รายชื่อผู้ใช้',
        href: '/dashboard/users',
        description: 'ดูสถานะผู้ใช้ทั้งหมดรวมถึงรายละเอียดบทบาท',
        match: (path) =>
          path === '/dashboard/users' ||
          (!!path?.startsWith('/dashboard/users/') && !path?.startsWith('/dashboard/users/create'))
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
  roleName: string | null;
  hideSidebar?: boolean;
  hideHeader?: boolean;
};

const isMenuItemActive = (pathname: string | null, item: MenuItem) => {
  if (!pathname) return false;
  if (typeof item.match === 'function') return item.match(pathname);
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
};

import { computeShouldHideLayout } from '../app/layoutUtils';

export function DashboardShell({
  children,
  currentUser,
  roleName,
  hideSidebar: propsHideSidebar = false,
  hideHeader: propsHideHeader = false
}: DashboardShellProps) {

  const pathname = usePathname();
  const shouldHide = computeShouldHideLayout(pathname || '');

  const hideSidebar = propsHideSidebar || shouldHide;
  const hideHeader = propsHideHeader || shouldHide;

  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const wrapperPadding = hideSidebar
    ? 'lg:pl-0'
    : isSidebarOpen
      ? 'lg:pl-72'
      : 'lg:pl-0';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Overlay เมื่อ sidebar เปิดบน mobile */}
      {!hideSidebar && (
        <div
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
          className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} fixed inset-0 z-40 bg-slate-900/40 transition-opacity duration-200 ease-in-out lg:hidden`}
        />
      )}

      {/* Sidebar */}
      {!hideSidebar && (
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 max-w-full border-r border-slate-200 bg-white px-6 py-8 shadow-2xl transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-translate-x-full'
            }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold tracking-tight text-slate-900">เมนู</p>
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="ปิดเมนู"
              className="rounded-full p-1 text-slate-500 hover:text-slate-900 transition"
            >
              ×
            </button>
          </div>

          <nav className="mt-8 flex h-full flex-col justify-between">
            <div className="space-y-8">
              {MENU_SECTIONS.map((section) => (
                <div key={section.title} className="space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{section.title}</p>
                    <p className="text-xs text-slate-500">{section.description}</p>
                  </div>

                  <div className="space-y-2">
                    {section.items.map((item) => {
                      const isActive = isMenuItemActive(pathname, item);
                      return (
                        <Link
                          key={item.label}
                          href={{ pathname: item.href }}
                          className={`group flex flex-col rounded-2xl px-3 py-2 transition ${isActive
                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/30'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                          <span className="text-sm font-semibold">{item.label}</span>
                          <span className="text-xs text-slate-500">{item.description}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">การดูแล</p>
              <p className="text-xs text-slate-500">เมนูสามารถขยายเพิ่มเติมได้ง่าย</p>
            </div>
          </nav>
        </aside>
      )}

      {/* Content */}
      <div className={`flex min-h-screen flex-col transition-all duration-200 ${wrapperPadding}`}>
        <div className="mx-auto w-full max-w-6xl px-6 py-8">
          {/* Header */}
          {!hideHeader && (
            <>
              <header className="flex flex-col gap-4 border-b border-slate-200 pb-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {!hideSidebar && (
                      <button
                        type="button"
                        onClick={() => setSidebarOpen((prev) => !prev)}
                        aria-expanded={isSidebarOpen}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:text-slate-900"
                      >
                        <span aria-hidden="true">{isSidebarOpen ? '×' : '☰'}</span>
                      </button>
                    )}
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">MyFood</p>
                      <h1 className="text-3xl font-semibold text-slate-900">ศูนย์ควบคุมแอดมิน</h1>
                    </div>
                  </div>

                  <LogoutButton />
                </div>

                <AdminHeaderProfile currentUser={currentUser} roleName={roleName} />
              </header>

              <Breadcrumbs
                labelMap={breadcrumbLabels}
                rootLabel="ศูนย์ควบคุมแอดมิน"
                rootHref="/dashboard"
                className="mb-6"
              />
            </>
          )}

          <AuthStateProvider initialUser={currentUser}>{children}</AuthStateProvider>
        </div>
      </div>
    </div>
  );
}
