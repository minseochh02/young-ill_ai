export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">영일오엔씨 Reports Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Welcome to the reports dashboard. Select a report from the navigation menu to view data.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="p-6 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Operations (Daily/Weekly)</h2>
          <p className="text-sm text-gray-600">
            일보현황, 일일매출수금현황, 재고파악시트, 장기재고현황
          </p>
        </div>

        <div className="p-6 bg-green-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">B2B Reports</h2>
          <p className="text-sm text-gray-600">
            B2B일일매출분석, B2B자료
          </p>
        </div>

        <div className="p-6 bg-purple-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">B2C Reports</h2>
          <p className="text-sm text-gray-600">
            B2C회의자료
          </p>
        </div>

        <div className="p-6 bg-orange-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Financial/AR</h2>
          <p className="text-sm text-gray-600">
            판매현황, 미거래업체현황, 장기미수금현황, 마감회의
          </p>
        </div>
      </div>
    </div>
  );
}
