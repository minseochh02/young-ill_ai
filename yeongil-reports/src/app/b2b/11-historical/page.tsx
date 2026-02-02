'use client';

import { useState } from 'react';
import DateSelector from '@/components/DateSelector';

export default function Report11() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">11. B2B자료 (B2B Historical Data)</h1>
      <p className="text-gray-600 mb-6">This will show reference data for trend comparison with 14 tabs: 자료 기준, 산업별, 팀별, 제품군, 거래처별, FPS, 지역, 신규, 산업유제품명, 전제품 판매, 누적실적, 거래처현황, 분류기준, 분류기준 신규.</p>

      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} label="Report Date" />
    </div>
  );
}
