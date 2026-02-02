'use client';

import { useState } from 'react';
import DateSelector from '@/components/DateSelector';

export default function Report06() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">06. B2B일일매출분석 (B2B Daily Sales Analysis)</h1>
      <p className="text-gray-600 mb-6">This will show daily overview of all branches' B2B sales performance with profitability analysis (DSP/ASP).</p>

      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} label="Report Date" />
    </div>
  );
}
