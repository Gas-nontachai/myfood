import Link from 'next/link';

import { Button } from '@myfood/shared-ui';

const storeName = 'MyFood สาขาเมนูหลัก';
const currentTable = 'โต๊ะ A12';

export default function CustomerHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-white/95 px-3 py-3 shadow-sm shadow-slate-200 backdrop-blur sm:px-0">
      <Button asChild intent="ghost" size="sm">
        <Link className="text-sm font-semibold text-gray-700" href="/customer/start">
          ← ย้อนกลับ
        </Link>
      </Button>
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-gray-500">MyFood</p>
        <p className="text-base font-semibold text-gray-900">{storeName}</p>
      </div>
      <div className="text-right text-xs font-semibold text-gray-600">{currentTable}</div>
    </header>
  );
}
