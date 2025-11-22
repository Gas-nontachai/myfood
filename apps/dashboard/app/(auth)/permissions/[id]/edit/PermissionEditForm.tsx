'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input } from '@myfood/shared-ui';
import { updatePermission, deletePermission } from '../../actions';

type Permission = {
    id: number;
    code: string;
    description: string | null;
};

type Props = {
    permission: Permission;
};

export function PermissionEditForm({ permission }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (formData: FormData) => {
        startTransition(async () => {
            const res = await updatePermission(permission.id, formData);
            if (res?.error) {
                alert(res.error);
            }
        });
    };

    const handleDelete = async () => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบสิทธิ์นี้?')) return;
        startTransition(async () => {
            const res = await deletePermission(permission.id);
            if (res?.error) {
                alert(res.error);
            }
        });
    };

    return (
        <Card className="max-w-2xl">
            <form action={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="code" className="text-sm font-medium text-slate-900">
                        รหัสสิทธิ์ (Code) <span className="text-red-500">*</span>
                    </label>
                    <Input id="code" name="code" defaultValue={permission.code} required />
                    <p className="text-xs text-slate-500">ควรใช้ภาษาอังกฤษตัวพิมพ์เล็กและจุด (.) เพื่อแบ่งหมวดหมู่</p>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-slate-900">
                        คำอธิบาย
                    </label>
                    <Input id="description" name="description" defaultValue={permission.description || ''} />
                </div>

                <div className="flex items-center justify-between border-t pt-6">
                    <Button type="button" intent="danger" onClick={handleDelete} disabled={isPending}>
                        ลบสิทธิ์
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
