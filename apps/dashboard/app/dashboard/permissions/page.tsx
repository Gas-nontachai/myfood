import Link from 'next/link';
import { Button, Card, Input, Toast } from '@myfood/shared-ui';
import { createAdminClient } from '../../../lib/supabaseAdmin';

type PermissionsPageParams = {
    searchParams?: Promise<{
        q?: string;
        created?: string;
        updated?: string;
        deleted?: string;
        error?: string;
    }>;
};

export default async function PermissionsPage({ searchParams }: PermissionsPageParams) {
    const resolvedParams = await searchParams;
    const admin = createAdminClient();
    const { data: permissions } = await admin
        .from('permissions')
        .select('*')
        .order('id', { ascending: true })
        .ilike('code', resolvedParams?.q ? `%${resolvedParams.q}%` : '%');

    const inlineAlerts = [] as { variant: 'success' | 'info' | 'warning'; title: string; description: string }[];
    if (resolvedParams?.created === 'true') {
        inlineAlerts.push({ variant: 'success', title: 'สร้างสิทธิ์สำเร็จ', description: 'สิทธิ์ใหม่พร้อมใช้งานแล้ว' });
    }
    if (resolvedParams?.updated === 'true') {
        inlineAlerts.push({ variant: 'success', title: 'อัปเดตสิทธิ์สำเร็จ', description: 'ข้อมูลสิทธิ์ได้รับการปรับปรุงแล้ว' });
    }
    if (resolvedParams?.deleted === 'true') {
        inlineAlerts.push({ variant: 'success', title: 'ลบสิทธิ์สำเร็จ', description: 'สิทธิ์ถูกลบออกจากระบบแล้ว' });
    }
    if (resolvedParams?.error) {
        inlineAlerts.push({ variant: 'warning', title: 'เกิดข้อผิดพลาด', description: resolvedParams.error });
    }

    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-400">จัดการสิทธิ์</p>
                    <h1 className="text-3xl font-semibold text-slate-900">สิทธิ์การใช้งาน</h1>
                </div>
                <Button intent="secondary" asChild>
                    <Link href="/dashboard/permissions/create">เพิ่มสิทธิ์ใหม่</Link>
                </Button>
            </div>

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
                <form className="flex flex-col gap-3 md:flex-row" method="get" action="/dashboard/permissions">
                    <Input name="q" placeholder="ค้นหารหัสสิทธิ์ (Code)" defaultValue={resolvedParams?.q ?? ''} />
                    <Button type="submit">ค้นหา</Button>
                </form>
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
                            {(permissions ?? []).map((permission) => (
                                <tr key={permission.id} className="border-t border-slate-100">
                                    <td className="px-3 py-3 text-slate-500">{permission.id}</td>
                                    <td className="px-3 py-3 font-mono text-slate-900">{permission.code}</td>
                                    <td className="px-3 py-3 text-slate-600">{permission.description || '-'}</td>
                                    <td className="px-3 py-3">
                                        <Link href={{ pathname: `/dashboard/permissions/${permission.id}/edit` }} className="text-sm text-brand-primary hover:underline">
                                            แก้ไข
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {permissions?.length === 0 && (
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
        </section>
    );
}
