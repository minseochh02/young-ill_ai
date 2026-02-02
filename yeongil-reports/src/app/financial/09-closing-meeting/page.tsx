'use client';

import { useState } from 'react';
import DateSelector from '@/components/DateSelector';

export default function Report09() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">09. 마감회의 (Closing Meeting Report)</h1>
      <p className="text-gray-600 mb-6">This will show end-of-month performance tracking with tabs: 실적 (actuals) and 계획 (plan).</p>

      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} label="Report Date" />
    </div>
  );
}
