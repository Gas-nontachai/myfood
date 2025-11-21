'use client';

import React from 'react';
import { Card } from '@myfood/shared-ui';
import { orderStatusSteps } from '../../data/mock-menu';

interface OrderStatusPageProps {
  params: Promise<{ orderId: string }>;
}

export default function OrderStatusPage({ params }: OrderStatusPageProps) {
  const { orderId } = React.use(params);

  const activeIndex = 1;
  const progressWidth = ((activeIndex + 1) / orderStatusSteps.length) * 100;

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">สถานะออเดอร์</p>
        <h1 className="text-3xl font-semibold text-gray-900">คำสั่งซื้อ #{orderId}</h1>
      </header>

      <Card className="space-y-5">
        <div className="space-y-5">
          {orderStatusSteps.map((step, index) => {
            const isActive = index <= activeIndex;
            const isCurrent = index === activeIndex;
            return (
              <div key={step.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`h-3 w-3 rounded-full ${isActive ? 'bg-amber-500' : 'bg-gray-300'}`}
                  />
                  <div>
                    <p className="text-base font-semibold text-gray-900">{step.label}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isCurrent
                      ? 'bg-amber-50 text-amber-600'
                      : isActive
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-white text-gray-300'
                  }`}
                >
                  {isCurrent ? 'กำลังดำเนินการ' : isActive ? 'เสร็จสิ้น' : 'รอ'}
                </span>
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">อัปเดตสถานะเรียลไทม์เพื่อให้คุณมั่นใจว่าสั่งถูกโต๊ะ</p>
        </div>
      </Card>
    </section>
  );
}
