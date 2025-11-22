'use client';

import { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input, Checkbox } from '@myfood/shared-ui';
import { updateRoleAndPermissions, deleteRole } from '../../actions';

type Role = {
    id: number;
    name: string;
    description: string | null;
};

type Permission = {
    id: number;
    code: string;
    description: string | null;
};

type Props = {
    role: Role;
    allPermissions: Permission[];
    assignedPermissionIds: number[];
};

export function RoleEditForm({ role, allPermissions, assignedPermissionIds }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>(assignedPermissionIds);

    const handleToggle = (permissionId: number) => {
        setSelectedPermissionIds(prev =>
            prev.includes(permissionId)
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const groupedPermissions = useMemo(() => {
        const groups: Record<string, Permission[]> = {};
        for (const p of allPermissions) {
            const [category] = p.code.split('.');
            if (!groups[category]) groups[category] = [];
            groups[category].push(p);
        }
        return groups;
    }, [allPermissions]);

    const handleSubmit = async (formData: FormData) => {
        startTransition(async () => {
            const res = await updateRoleAndPermissions(role.id, formData, selectedPermissionIds);
            if (res?.error) alert(res.error);
        });
    };

    const handleDelete = async () => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบบทบาทนี้?')) return;
        startTransition(async () => {
            try {
                await deleteRole(role.id);
            } catch (error: any) {
                alert(error.message);
            }
        });
    };

    return (
        <Card className="max-w-4xl space-y-10 p-8">
            <form action={handleSubmit} className="space-y-10">

                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900">ข้อมูลทั่วไป</h2>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor="name" className="font-medium text-slate-700">
                                ชื่อบทบาท <span className="text-red-500">*</span>
                            </label>
                            <Input id="name" name="name" defaultValue={role.name} required />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="font-medium text-slate-700">
                                คำอธิบาย
                            </label>
                            <Input id="description" name="description" defaultValue={role.description ?? ''} />
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-lg font-semibold text-slate-900">สิทธิ์การใช้งาน</h2>

                    {Object.entries(groupedPermissions).map(([category, permissions]) => (
                        <div key={category} className="space-y-4">
                            <h3 className="text-md font-semibold capitalize text-slate-800">
                                {category}
                            </h3>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {permissions.map((p) => (
                                    <Checkbox
                                        key={p.id}
                                        label={p.code}
                                        description={p.description || ''}
                                        checked={selectedPermissionIds.includes(p.id)}
                                        onChange={() => handleToggle(p.id)}
                                        className="h-full" />
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                <div className="flex justify-between items-center border-t pt-6">
                    <Button
                        type="button"
                        intent="danger"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        ลบบทบาท
                    </Button>

                    <div className="flex gap-4">
                        <Button
                            type="button"
                            intent="secondary"
                            onClick={() => router.push('/roles')}
                            disabled={isPending}
                        >
                            ยกเลิก
                        </Button>

                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                        </Button>
                    </div>
                </div>

            </form>
        </Card>
    );
}
