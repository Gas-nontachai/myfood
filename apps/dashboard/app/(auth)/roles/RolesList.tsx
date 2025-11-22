'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, Toast } from '@myfood/shared-ui';
import { TextSearchInput } from '../../../components/TextSearchInput';

type Role = {
    id: number;
    name: string;
    description: string | null;
};

type RolesListProps = {
    roles: Role[];
    searchParams?: {
        created?: string;
        updated?: string;
        deleted?: string;
        error?: string;
    };
};

export function RolesList({ roles, searchParams }: RolesListProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRoles = roles.filter((role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const inlineAlerts = [] as { variant: 'success' | 'info' | 'warning'; title: string; description: string }[];
    if (searchParams?.created === 'true') {
        inlineAlerts.push({ variant: 'success', title: 'สร้างบทบาทสำเร็จ', description: 'บทบาทใหม่พร้อมใช้งานแล้ว' });
    }
    if (searchParams?.updated === 'true') {
        inlineAlerts.push({ variant: 'success', title: 'อัปเดตบทบาทสำเร็จ', description: 'ข้อมูลบทบาทได้รับการปรับปรุงแล้ว' });
    }
    if (searchParams?.deleted === 'true') {
        inlineAlerts.push({ variant: 'success', title: 'ลบบทบาทสำเร็จ', description: 'บทบาทถูกลบออกจากระบบแล้ว' });
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
                <div className="flex flex-col gap-3 md:flex-row">
                    <TextSearchInput
                        name="q"
                        placeholder="ค้นหาชื่อบทบาท"
                        value={searchTerm}
                        onChange={setSearchTerm}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead>
                            <tr className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                <th className="px-3 py-2">ID</th>
                                <th className="px-3 py-2">ชื่อบทบาท</th>
                                <th className="px-3 py-2">คำอธิบาย</th>
                                <th className="px-3 py-2">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRoles.map((role) => (
                                <tr key={role.id} className="border-t border-slate-100">
                                    <td className="px-3 py-3 text-slate-500">{role.id}</td>
                                    <td className="px-3 py-3 font-semibold text-slate-900">{role.name}</td>
                                    <td className="px-3 py-3 text-slate-600">{role.description || '-'}</td>
                                    <td className="px-3 py-3">
                                        <Link href={`/roles/${role.id}/edit`} className="text-sm text-brand-primary hover:underline">
                                            แก้ไข
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filteredRoles.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-3 py-8 text-center text-slate-500">
                                        ไม่พบข้อมูลบทบาท
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
