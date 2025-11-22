'use client';

import { useFormState } from 'react-dom';
import Link from 'next/link';
import { Button, Card, Input } from '@myfood/shared-ui';
import { createPermission } from '../actions';

export default function CreatePermissionPage() {
    const [state, action] = useFormState(createPermission, {});

    return (
        <section className="space-y-6">
            <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">จัดการสิทธิ์</p>
                <h1 className="text-3xl font-semibold text-slate-900">สร้างสิทธิ์ใหม่</h1>
            </div>

            <Card className="max-w-2xl">
                <form action={action} className="space-y-6">
                    {state?.error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                            {state.error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label htmlFor="code" className="text-sm font-medium text-slate-900">
                            รหัสสิทธิ์ (Code) <span className="text-red-500">*</span>
                        </label>
                        <Input id="code" name="code" placeholder="เช่น user.manage, report.view" required />
                        <p className="text-xs text-slate-500">ควรใช้ภาษาอังกฤษตัวพิมพ์เล็กและจุด (.) เพื่อแบ่งหมวดหมู่</p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium text-slate-900">
                            คำอธิบาย
                        </label>
                        <Input id="description" name="description" placeholder="รายละเอียดของสิทธิ์นี้" />
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <Button type="submit">บันทึก</Button>
                        <Button type="button" intent="secondary" asChild>
                            <Link href={{ pathname: "/permissions" }}>ยกเลิก</Link>
                        </Button>
                    </div>
                </form>
            </Card>
        </section>
    );
}
