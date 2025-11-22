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
  ChevronRight,
  CookingPot,
  Package,
  Menu
} from 'lucide-react';

import { computeShouldHideLayout } from '../app/layoutUtils';

type MenuItem = {
  label: string;
  href: string;
  icon?: ReactNode;
  match?: (_path: string | null) => boolean; // eslint-disable-line no-unused-vars
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
        href: '/',
        icon: <Home size={20} />
      }
    ]
  },
  {
    title: 'จัดการผู้ใช้',
    items: [
      {
        label: 'รายชื่อผู้ใช้',
        href: '/users',
        icon: <Users size={20} />,
        match: (path) =>
          path === '/users' ||
          (!!path?.startsWith('/users/') && !path?.startsWith('/users/create'))
      }
    ]
  },
  {
    title: 'จัดการสิทธิ์',
    items: [
      {
        label: 'บทบาทผู้ใช้งาน',
        href: '/roles',
        icon: <Shield size={20} />,
        match: (path) => path === '/roles' || !!path?.startsWith('/roles/')
      },
      {
        label: 'สิทธิ์การใช้งาน',
        href: '/permissions',
        icon: <KeyRound size={20} />,
        match: (path) =>
          path === '/permissions' || !!path?.startsWith('/permissions/')
      }
    ]
  },
  {
    title: 'จัดการสินค้า',
    items: [
      {
        label: 'รายการสินค้า',
        href: '/product',
        icon: <Package size={20} />,
        match: (path) => path === '/product' || !!path?.startsWith('/product/')
      },
      {
        label: 'ประเภทสินค้า',
        href: '/product_category',
        icon: <CookingPot size={20} />,
        match: (path) =>
          path === '/product_category' ||
          !!path?.startsWith('/product_category/')
      }
    ]
  }
];

const breadcrumbLabels = {
  '/': 'ภาพรวมระบบ',
  '/users': 'จัดการผู้ใช้',
  '/users/create': 'สร้างผู้ใช้ใหม่',
  '/users/[id]': 'โปรไฟล์ผู้ใช้',
  '/users/[id]/edit': 'แก้ไขบัญชี',
  '/roles': 'บทบาทผู้ใช้งาน',
  '/roles/create': 'สร้างบทบาทใหม่',
  '/roles/[id]': 'รายละเอียดบทบาท',
  '/roles/[id]/edit': 'แก้ไขบทบาท',
  '/permissions': 'สิทธิ์การใช้งาน',
  '/permissions/create': 'สร้างสิทธิ์ใหม่',
  '/permissions/[id]/edit': 'แก้ไขสิทธิ์',
  '/product': 'จัดการสินค้า',
  '/product/create': 'สร้างสินค้าใหม่',
  '/product/[id]/edit': 'แก้ไขสินค้า',
  '/product_category': 'จัดการประเภทสินค้า',
  '/product_category/create': 'สร้างประเภทสินค้า',
  '/product_category/[id]': 'รายละเอียดประเภทสินค้า',
  '/product_category/[id]/edit': 'แก้ไขประเภทสินค้า',
  '/no-access': 'สิทธิ์ไม่เพียงพอ',
  '/login': 'เข้าสู่ระบบแอดมิน',
  '/account-disabled': 'บัญชีถูกระงับ',
  '/reports': 'รายงานประจำสัปดาห์'
};

const isMenuItemActive = (pathname: string | null, item: MenuItem) => {
  if (!pathname) return false;

  if (item.href === '/') {
    return pathname === '/';
  }

  if (typeof item.match === 'function') return item.match(pathname);

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
};

type DashboardShellProps = {
  children: ReactNode;
  currentUser: SessionWithAuth | null;
  hideSidebar?: boolean;
  hideHeader?: boolean;
};

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

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  const wrapperPadding = hideSidebar
    ? 'lg:pl-0'
    : compact
      ? 'lg:pl-20'
      : 'lg:pl-72';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Mobile / Tablet overlay */}
      {!hideSidebar && (
        <div
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
          className={`
            fixed inset-0 z-40 bg-slate-900/40 transition-opacity duration-200
            ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            lg:hidden
          `}
        />
      )}

      {/* Sidebar */}
      {!hideSidebar && (
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 shadow-xl
            px-4 py-8
            transition-all duration-200 ease-in-out

            ${compact ? 'w-20' : 'w-72'}

            /* Mobile + Tablet slide */
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            /* Desktop always open */
            lg:translate-x-0
          `}
        >
          {/* Toggle compact mode (desktop only) */}
          <button
            onClick={() => setCompact(!compact)}
            className="absolute -right-3 top-6 z-50 hidden lg:flex h-6 w-6 items-center justify-center rounded-full border bg-white shadow hover:bg-slate-50"
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
                          onClick={() => setSidebarOpen(false)}
                          className={`
                            group flex items-center gap-3 rounded-2xl px-3 py-2 transition
                            ${isActive
                              ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/30'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }
                          `}
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
        <div className="mx-auto w-full max-w-6xl px-6 py-2">

          {/* Header */}
          {!hideHeader && (
            <>
              <header className="flex flex-col gap-4 border-b border-slate-200 pb-2">

                <div className="flex items-center justify-between gap-4">

                  {/* Sidebar toggle button (mobile + tablet only) */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="lg:hidden p-2 rounded-md hover:bg-slate-100"
                    >
                      <Menu size={20} />
                    </button>

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
                rootHref="/"
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
