'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input, Checkbox } from '@myfood/shared-ui';
import { updateRole, updateRolePermissions, deleteRole } from '../../actions';

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

    const handlePermissionToggle = (permissionId: number) => {
        setSelectedPermissionIds((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleSubmit = async (formData: FormData) => {
        startTransition(async () => {
            const resRole = await updateRole(role.id, null, formData);
            if (resRole?.error) {
                alert(resRole.error);
                return;
            }

            try {
                await updateRolePermissions(role.id, selectedPermissionIds);
            } catch (error: any) {
                alert(error.message);
                return;
            }
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
        <Card className="max-w-4xl">
            <form action={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">ข้อมูลทั่วไป</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-slate-900">
                                ชื่อบทบาท <span className="text-red-500">*</span>
                            </label>
                            <Input id="name" name="name" defaultValue={role.name} required />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium text-slate-900">
                                คำอธิบาย
                            </label>
                            <Input id="description" name="description" defaultValue={role.description || ''} />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">สิทธิ์การใช้งาน</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {allPermissions.map((permission) => (
                            <Checkbox
                                key={permission.id}
                                label={permission.code}
                                description={permission.description || ''}
                                checked={selectedPermissionIds.includes(permission.id)}
                                onChange={() => handlePermissionToggle(permission.id)}
                                className="h-full"
                            />
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between border-t pt-6">
                    <Button type="button" intent="danger" onClick={handleDelete} disabled={isPending}>
                        ลบบทบาท
                    </Button>
                    <div className="flex gap-4">
                        <Button type="button" intent="secondary" onClick={() => router.back()} disabled={isPending}>
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
