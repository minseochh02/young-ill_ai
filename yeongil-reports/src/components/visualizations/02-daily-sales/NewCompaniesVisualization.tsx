'use client';

import { useEffect, useState } from 'react';

interface NewCompany {
  date: string;
  company: string;
  location: string;
  note: string;
}

interface NewCompaniesVisualizationProps {
  date?: string;
  branch?: string;
  title?: string;
}

export default function NewCompaniesVisualization({
  date,
  branch,
  title = "신규개척업체 (Newly Developed Companies)"
}: NewCompaniesVisualizationProps) {

  const [data, setData] = useState<NewCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const selectedDate = date || new Date().toISOString().split('T')[0];
        const selectedBranch = branch || '화성IL';
        const response = await fetch(`/api/operations/02-daily-sales?date=${selectedDate}&branch=${selectedBranch}`);
        const result = await response.json();

        if (result.success && result.data && result.data.newlyDevelopedCompanies) {
          setData(result.data.newlyDevelopedCompanies.filter((item: any) => item !== null));
        }
      } catch (error) {
        console.error('Failed to fetch new companies data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date, branch]);

  // Mock data
  const mockData: NewCompany[] = [
    { date: '2026-01-15', company: '태양기계공업', location: '경기 화성시 향남읍', note: '자동차 부품 제조업체 / 월 예상 매출 2,500만원' },
    { date: '2026-01-18', company: '동부정밀', location: '경기 평택시 포승읍', note: '정밀 금형 제작 / 월 예상 매출 1,800만원' },
    { date: '2026-01-22', company: '한성산업기계', location: '충남 아산시 영인면', note: '산업용 기계 제조 / 월 예상 매출 3,200만원' },
    { date: '2026-01-28', company: '미래테크', location: '경기 안산시 단원구', note: 'LED 조명 제조업체 / 월 예상 매출 1,500만원' },
    { date: '2026-02-02', company: '대한철강', location: '경기 시흥시 정왕동', note: '철강 가공업 / 월 예상 매출 4,000만원' },
  ];

  const companies = data.length > 0 ? data : mockData;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <div className="text-gray-600">Loading data...</div>
        </div>
      </div>
    );
  }

  // Group by month
  const groupedByMonth = companies.reduce((acc, company) => {
    const month = company.date.substring(0, 7); // YYYY-MM
    if (!acc[month]) acc[month] = [];
    acc[month].push(company);
    return acc;
  }, {} as Record<string, NewCompany[]>);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-blue-900">{title}</h2>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">신규 개척 업체</h3>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-900">{companies.length}개</div>
            <p className="text-xs text-gray-600 mt-1">New Companies</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">이번 달</h3>
          </div>
          <div>
            <div className="text-3xl font-bold text-teal-900">
              {Object.keys(groupedByMonth).length > 0
                ? groupedByMonth[Object.keys(groupedByMonth).sort().pop()!]?.length || 0
                : 0}개
            </div>
            <p className="text-xs text-gray-600 mt-1">This Month</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-2 border-cyan-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-600">평균 (월)</h3>
          </div>
          <div>
            <div className="text-3xl font-bold text-cyan-900">
              {Object.keys(groupedByMonth).length > 0
                ? (companies.length / Object.keys(groupedByMonth).length).toFixed(1)
                : 0}개
            </div>
            <p className="text-xs text-gray-600 mt-1">Monthly Average</p>
          </div>
        </div>
      </div>

      {/* Company Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companies.map((company, idx) => (
          <div key={idx} className="bg-white border-2 border-emerald-200 rounded-lg shadow-sm hover:shadow-lg transition-all hover:scale-[1.02]">
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🏭</span>
                    <h3 className="text-lg font-bold text-emerald-900">{company.company}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <span>📍</span>
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>📅</span>
                    <span>{company.date}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                    신규
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-transparent border-l-4 border-emerald-500 rounded">
                <p className="text-sm text-gray-700">{company.note}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline View */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">개척 타임라인 (Development Timeline)</h3>
        </div>
        <div className="p-6">
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-emerald-300"></div>

            <div className="space-y-6">
              {companies.map((company, idx) => (
                <div key={idx} className="relative pl-16">
                  {/* Timeline Dot */}
                  <div className="absolute left-6 top-2 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white shadow"></div>

                  {/* Content */}
                  <div className="bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-bold text-emerald-900 text-lg mb-1">{company.company}</div>
                        <div className="text-sm text-gray-600">📍 {company.location}</div>
                      </div>
                      <div className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                        {company.date}
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-700 bg-white p-3 rounded border-l-2 border-emerald-400">
                      {company.note}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">월별 개척 현황 (Monthly Development Summary)</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {Object.keys(groupedByMonth).sort().reverse().map((month, idx) => {
              const monthCompanies = groupedByMonth[month];
              const percentage = (monthCompanies.length / companies.length) * 100;

              return (
                <div key={idx} className="border rounded-lg p-4 hover:bg-emerald-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-700">{month}</div>
                    <div className="text-lg font-bold text-emerald-600">{monthCompanies.length}개 업체</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage > 15 && (
                        <span className="text-white text-xs font-semibold">{percentage.toFixed(0)}%</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {monthCompanies.map(c => c.company).join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
