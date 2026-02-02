'use client';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  label?: string;
}

export default function DateSelector({ selectedDate, onDateChange, label = "Report Date" }: DateSelectorProps) {
  return (
    <div className="mb-6 p-5 bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-slate-300 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <label htmlFor="date-selector" className="text-lg font-semibold text-gray-800 min-w-[140px]">
          📅 {label}:
        </label>
        <input
          type="date"
          id="date-selector"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="flex-1 max-w-md border-2 border-gray-300 rounded-lg px-5 py-3 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        />
        <div className="flex-1 text-right">
          <span className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm">
            Selected: <span className="font-semibold text-blue-700">{selectedDate || 'Not selected'}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
