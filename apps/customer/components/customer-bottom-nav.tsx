import Link from 'next/link';

const navItems = [
  { label: 'เมนู', href: '/menu', icon: '🍜' },
  { label: 'ตะกร้า', href: '/customer/cart', icon: '🛒' },
  { label: 'สถานะ', href: '/customer/status/order-123', icon: '🕒' }
];

export default function CustomerBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-sm shadow-slate-200 backdrop-blur">
      <div className="flex items-center justify-between">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href as any}
            className="flex flex-1 flex-col items-center gap-1 text-xs font-semibold text-gray-600"
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
