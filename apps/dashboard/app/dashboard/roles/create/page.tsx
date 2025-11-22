"use client";

import Link from 'next/link';
import { Button, Card, Input } from '@myfood/shared-ui';
import { createRole } from '../actions';
import { useActionState } from "react";

export default function CreateRolePage() {
    const [state, formAction] = useActionState(createRole, { error: '' });

    return (
        <section className="space-y-6">
            <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">จัดการสิทธิ์</p>
                <h1 className="text-3xl font-semibold text-slate-900">สร้างบทบาทใหม่</h1>
            </div>

            <Card className="max-w-2xl">
                <form action={formAction} className="space-y-6">

                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-slate-900">
                            ชื่อบทบาท <span className="text-red-500">*</span>
                        </label>
                        <Input id="name" name="name" placeholder="เช่น Manager, Staff" required />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium text-slate-900">
                            คำอธิบาย
                        </label>
                        <Input id="description" name="description" placeholder="รายละเอียดหน้าที่ความรับผิดชอบ" />
                    </div>

                    {state.error && (
                        <p className="text-sm text-red-600">{state.error}</p>
                    )}

                    <div className="flex items-center gap-4 pt-4">
                        <Button type="submit">บันทึก</Button>
                        <Button type="button" intent="secondary" asChild>
                            <Link href="/dashboard/roles">ยกเลิก</Link>
                        </Button>
                    </div>

                </form>
            </Card>
        </section>
    );
}
