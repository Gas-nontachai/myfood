import Link from 'next/link';

import { Button, Card } from '@myfood/shared-ui';

const arrivalMode: 'qr' | 'walkin' = 'qr';
const mockTableName = 'โต๊ะ A12';
const mockBranch = 'MyFood สาขาเซ็นทรัลเวิลด์';

export default function StartPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">ลงชื่อเข้าใช้</p>
        <h1 className="text-3xl font-semibold text-gray-900">เลือกโต๊ะ หรือสาขาที่สะดวก</h1>
        <p className="text-sm text-gray-600">
          เริ่มสั่งอาหารได้ทันที เมื่อเลือกโต๊ะ หรือระบุสาขา เพื่อให้พนักงานทราบตำแหน่งของคุณ
        </p>
      </header>

      <Card className="space-y-4">
        {arrivalMode === 'qr' ? (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-600">สแกนคิวอาร์โค้ดโต๊ะ</p>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-5 text-center text-lg font-semibold text-amber-900">
              {mockTableName}
            </div>
            <p className="text-xs text-gray-500">
              ระบบจับคู่โต๊ะอัตโนมัติจากคิวอาร์โค้ดบนโต๊ะของคุณ
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-inner">
              <p className="text-xs uppercase text-gray-500">เลือกสาขา</p>
              <p className="text-base font-semibold text-gray-900">{mockBranch}</p>
              <p className="text-sm text-gray-500">รองรับที่นั่งทั้งโซนหลัก และสไตล์คาเฟ่</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-inner">
              <p className="text-xs uppercase text-gray-500">เลือกโต๊ะ</p>
              <p className="text-base font-semibold text-gray-900">โต๊ะที่คุณต้องการ</p>
              <p className="text-sm text-gray-500">เลือกโซนริมหน้าต่าง หรือโซนใจกลางร้าน</p>
            </div>
          </div>
        )}
      </Card>

      <Button asChild className="w-full" intent="primary" size="lg">
        <Link href="/menu">เริ่มสั่งอาหาร</Link>
      </Button>
    </section>
  );
}
