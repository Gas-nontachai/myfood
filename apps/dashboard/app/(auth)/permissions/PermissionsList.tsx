'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, Toast } from '@myfood/shared-ui';
import { TextSearchInput } from '../../../components/TextSearchInput';
import { PermissionsListProps } from '../../../types';


export function PermissionsList({ permissions, searchParams }: PermissionsListProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPermissions = permissions.filter((permission) =>
        permission.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const inlineAlerts = [] as { variant: 'success' | 'info' | 'warning'; title: string; description: string }[];
    if (searchParams?.created === 'true') {
        inlineAlerts.push({ variant: 'success', title: 'สร้างสิทธิ์สำเร็จ', description: 'สิทธิ์ใหม่พร้อมใช้งานแล้ว' });
    }
    if (searchParams?.updated === 'true') {
        inlineAlerts.push({ variant: 'success', title: 'อัปเดตสิทธิ์สำเร็จ', description: 'ข้อมูลสิทธิ์ได้รับการปรับปรุงแล้ว' });
    }
    if (searchParams?.deleted === 'true') {
        inlineAlerts.push({ variant: 'success', title: 'ลบสิทธิ์สำเร็จ', description: 'สิทธิ์ถูกลบออกจากระบบแล้ว' });
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
                        placeholder="ค้นหารหัสสิทธิ์ (Code)"
                        value={searchTerm}
                        onChange={setSearchTerm}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead>
                            <tr className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                <th className="px-3 py-2">ID</th>
                                <th className="px-3 py-2">รหัสสิทธิ์ (Code)</th>
                                <th className="px-3 py-2">คำอธิบาย</th>
                                <th className="px-3 py-2">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPermissions.map((permission) => (
                                <tr key={permission.id} className="border-t border-slate-100">
                                    <td className="px-3 py-3 text-slate-500">{permission.id}</td>
                                    <td className="px-3 py-3 font-mono text-slate-900">{permission.code}</td>
                                    <td className="px-3 py-3 text-slate-600">{permission.description || '-'}</td>
                                    <td className="px-3 py-3">
                                        <Link href={{ pathname: `/permissions/${permission.id}/edit` }} className="text-sm text-brand-primary hover:underline">
                                            แก้ไข
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filteredPermissions.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-3 py-8 text-center text-slate-500">
                                        ไม่พบข้อมูลสิทธิ์
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
