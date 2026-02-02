'use client';

import { useState } from 'react';
import DateSelector from '@/components/DateSelector';

export default function Report08() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">08. 장기미수금현황 (Long-term AR Outstanding)</h1>
      <p className="text-gray-600 mb-6">This will show overdue receivables with current month summary tab and 7 branch tabs: 화성, 창원, 부산, 동부, 서부, 중부, 제주.</p>

      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} label="Report Date" />
    </div>
  );
}
