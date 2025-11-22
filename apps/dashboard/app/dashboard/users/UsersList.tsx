'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, Toast } from '@myfood/shared-ui';
import { TextSearchInput } from '../../../components/TextSearchInput';

type Profile = {
    user_id: string;
    username: string | null;
    full_name: string | null;
    status: string | null;
    role_primary: number | null;
    created_at: string;
};

type UsersListProps = {
    profiles: Profile[];
    roles: { id: number; name: string }[];
    searchParams?: {
        created?: string;
        error?: string;
        disabled?: string;
        restored?: string;
        passwordReset?: string;
    };
};

const formatDate = (value: string) =>
    new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export function UsersList({ profiles, roles, searchParams }: UsersListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');

    const roleById = new Map(roles.map((role) => [role.id, role.name]));

    const tabProfiles = profiles.filter((p) => {
        return activeTab === 'active'
            ? p.status === 'active'
            : p.status !== 'active';
    });

    const filteredProfiles = tabProfiles.filter((profile) =>
        (profile.username || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const inlineAlerts = [] as { variant: 'success' | 'info' | 'warning'; title: string; description: string }[];
    if (searchParams?.created === 'true') {
        inlineAlerts.push({ variant: 'success', title: 'ผู้ใช้ถูกสร้างแล้ว', description: 'เปิดดูรายละเอียดหรือกำหนดสิทธิ์เพิ่มเติมได้' });
    }
    if (searchParams?.disabled) {
        inlineAlerts.push({ variant: 'warning', title: 'ผู้ใช้ถูกปิดใช้งาน', description: 'บัญชีนี้จะไม่สามารถล็อกอินได้จนกว่าจะกู้คืน' });
    }
    if (searchParams?.restored) {
        inlineAlerts.push({ variant: 'success', title: 'เรียกคืนบัญชีสำเร็จ', description: 'ผู้ใช้สามารถล็อกอินได้อีกครั้ง' });
    }
    if (searchParams?.passwordReset) {
        inlineAlerts.push({ variant: 'info', title: 'รีเซ็ตรหัสผ่านแล้ว', description: 'ผู้ใช้สามารถใช้รหัสผ่านใหม่ได้ทันที' });
    }
    if (searchParams?.error) {
        inlineAlerts.push({ variant: 'warning', title: 'เกิดข้อผิดพลาด', description: searchParams.error });
    }

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                {inlineAlerts.map((toast) => (
                    <Toast
                        key={toast.title}
                        variant={toast.variant}
                        title={toast.title}
                        description={toast.description}
                    />
                ))}
            </div>

            <Card className="space-y-4">

                <div className="flex border-b border-slate-200 text-sm">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-4 py-2 -mb-px border-b-2 transition ${activeTab === 'active'
                            ? 'border-brand-primary text-brand-primary font-semibold'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        ผู้ใช้ Active
                    </button>

                    <button
                        onClick={() => setActiveTab('inactive')}
                        className={`px-4 py-2 -mb-px border-b-2 transition ${activeTab === 'inactive'
                            ? 'border-brand-primary text-brand-primary font-semibold'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        ผู้ใช้ Inactive
                    </button>
                </div>

                <div className="flex flex-col gap-3 md:flex-row">
                    <TextSearchInput
                        name="q"
                        placeholder="ค้นหาชื่อผู้ใช้"
                        value={searchTerm}
                        onChange={setSearchTerm}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead>
                            <tr className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                <th className="px-3 py-2">ชื่อผู้ใช้</th>
                                <th className="px-3 py-2">บทบาทหลัก</th>
                                <th className="px-3 py-2">วันที่สร้าง</th>
                                <th className="px-3 py-2">สถานะ</th>
                                <th className="px-3 py-2">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProfiles.map((profile) => (
                                <tr key={profile.user_id} className="border-t border-slate-100">
                                    <td className="px-3 py-3">
                                        <Link href={`/dashboard/users/${profile.user_id}`} className="font-semibold text-slate-900">
                                            {profile.username}
                                        </Link>
                                        <p className="text-xs text-slate-500">{profile.full_name ?? 'ชื่อเต็มยังไม่ได้ระบุ'}</p>
                                    </td>
                                    <td className="px-3 py-3 text-slate-600">
                                        {roleById.get(profile.role_primary ?? -1) ?? 'ไม่ระบุบทบาท'}
                                    </td>
                                    <td className="px-3 py-3 text-slate-500">{formatDate(profile.created_at)}</td>
                                    <td className="px-3 py-3">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${profile.status === 'active'
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'bg-amber-50 text-amber-800'
                                                }`}
                                        >
                                            {profile.status === 'active' ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3">
                                        <Link href={`/dashboard/users/${profile.user_id}`} className="text-sm text-brand-primary">
                                            ดูรายละเอียด
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {filteredProfiles.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-3 py-6 text-center text-slate-400">
                                        ไม่พบผู้ใช้ในหมวดนี้
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
