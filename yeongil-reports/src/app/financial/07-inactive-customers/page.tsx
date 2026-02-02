'use client';

import { useState } from 'react';
import DateSelector from '@/components/DateSelector';

export default function Report07() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">07. 미거래업체현황 (Inactive Customer Status)</h1>
      <p className="text-gray-600 mb-6">This will show customers with no transactions (3+ months) with tabs for: 화성, 창원, 부산, 동부, 서부, 중부, 제주.</p>

      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} label="Report Date" />
    </div>
  );
}
