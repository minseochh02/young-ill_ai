export default function Report01() {
  const branches = ['서울/화성IL', '창원', '화성auto(남부)', '화성auto(중부)', '인천(서부)', '남양주(동부)', '제주', '부산'];
  const branches2 = ['화성IL', '창원', '화성auto(남부)', '화성auto(중부)', '인천(서부)', '남양주(동부)', '제주', '부산'];
  const mobilBranches = ['화성 IL', '창원 IL', '화성 AUTO (중부)', '남부지사', '인천(서부)', '남양주(동부)', '제주', '부산', 'Total', '잔액'];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">01. 일보현황 (Daily Report)</h1>
      <p className="text-sm text-gray-500 mb-8">Daily operational report covering all branches - 6 sections</p>

      {/* Section 1: 매출현황 */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">Section 1: 매출현황 (Sales Status)</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* 일계 (Daily) */}
          <div>
            <h3 className="text-sm font-semibold mb-2 bg-blue-100 p-2">일계 (Daily)</h3>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1" rowSpan={2}>Branch</th>
                    <th className="border px-2 py-1" colSpan={3}>모빌 Sell-out</th>
                    <th className="border px-2 py-1" colSpan={2}>모빌 Sell-in</th>
                  </tr>
                  <tr className="bg-gray-50">
                    <th className="border px-2 py-1 text-xs">총매출액<br/>모빌금액</th>
                    <th className="border px-2 py-1 text-xs">Total(L)</th>
                    <th className="border px-2 py-1 text-xs">Flagship(L)</th>
                    <th className="border px-2 py-1 text-xs">Total(L)</th>
                    <th className="border px-2 py-1 text-xs">Flagship(L)</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map((branch, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-2 py-1 text-xs">{branch}</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                    </tr>
                  ))}
                  <tr className="font-semibold bg-gray-100">
                    <td className="border px-2 py-1 text-xs">Total</td>
                    <td className="border px-2 py-1 text-right">-</td>
                    <td className="border px-2 py-1 text-right">-</td>
                    <td className="border px-2 py-1 text-right">-</td>
                    <td className="border px-2 py-1 text-right">-</td>
                    <td className="border px-2 py-1 text-right">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 월누계 (Monthly Cumulative) */}
          <div>
            <h3 className="text-sm font-semibold mb-2 bg-blue-100 p-2">월누계 (Monthly Cumulative)</h3>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1" rowSpan={2}>Branch</th>
                    <th className="border px-2 py-1" colSpan={3}>모빌 Sell-out</th>
                    <th className="border px-2 py-1" colSpan={2}>모빌 Sell-in</th>
                  </tr>
                  <tr className="bg-gray-50">
                    <th className="border px-2 py-1 text-xs">총매출액<br/>모빌금액</th>
                    <th className="border px-2 py-1 text-xs">Total(L)</th>
                    <th className="border px-2 py-1 text-xs">Flagship(L)</th>
                    <th className="border px-2 py-1 text-xs">Total(L)</th>
                    <th className="border px-2 py-1 text-xs">Flagship(L)</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map((branch, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-2 py-1 text-xs">{branch}</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                    </tr>
                  ))}
                  <tr className="font-semibold bg-gray-100">
                    <td className="border px-2 py-1 text-xs">Total</td>
                    <td className="border px-2 py-1 text-right">-</td>
                    <td className="border px-2 py-1 text-right">-</td>
                    <td className="border px-2 py-1 text-right">-</td>
                    <td className="border px-2 py-1 text-right">-</td>
                    <td className="border px-2 py-1 text-right">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: 외상매출금 현황 */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">Section 2: 외상매출금 현황 (AR / Collections Status) <span className="text-sm font-normal text-gray-500">단위(원)</span></h2>

        <div className="grid grid-cols-3 gap-4">
          {/* 일계 (Daily) */}
          <div>
            <h3 className="text-sm font-semibold mb-2 bg-green-100 p-2">일계 (Daily)</h3>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">Branch</th>
                    <th className="border px-2 py-1">총수금액</th>
                    <th className="border px-2 py-1">현금</th>
                    <th className="border px-2 py-1">어음</th>
                    <th className="border px-2 py-1">카드</th>
                    <th className="border px-2 py-1">기타</th>
                  </tr>
                </thead>
                <tbody>
                  {branches2.map((branch, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-2 py-1 text-xs">{branch}</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                    </tr>
                  ))}
                  <tr className="font-semibold bg-gray-100">
                    <td className="border px-2 py-1 text-xs">Total</td>
                    <td className="border px-2 py-1 text-right">-</td>
                    <td className="border px-2 py-1 text-right">-</td>
                    <td className="border px-2 py-1 text-right">-</td>
                    <td className="border px-2 py-1 text-right">-</td>
                    <td className="border px-2 py-1 text-right">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 누계 (Monthly Cumulative) */}
          <div>
            <h3 className="text-sm font-semibold mb-2 bg-green-100 p-2">누계 (Monthly Cumulative)</h3>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">Branch</th>
                    <th className="border px-2 py-1">총수금액</th>
                    <th className="border px-2 py-1">현금</th>
                    <th className="border px-2 py-1">어음</th>
                    <th className="border px-2 py-1">카드</th>
                    <th className="border px-2 py-1">기타</th>
                  </tr>
                </thead>
                <tbody>
                  {branches2.map((branch, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-2 py-1 text-xs">{branch}</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                    </tr>
                  ))}
                  <tr className="font-semibold bg-gray-100">
                    <td className="border px-2 py-1 text-xs">Total</td>
                    <td className="border px-2 py-1 text-right">-</td>
                    <td className="border px-2 py-1 text-right">-</td>
                    <td className="border px-2 py-1 text-right">-</td>
                    <td className="border px-2 py-1 text-right">-</td>
                    <td className="border px-2 py-1 text-right">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 외상매출금 (AR Balance) */}
          <div>
            <h3 className="text-sm font-semibold mb-2 bg-green-100 p-2">외상매출금 (AR Balance)</h3>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">Branch</th>
                    <th className="border px-2 py-1">전월잔액</th>
                    <th className="border px-2 py-1">당월매출</th>
                    <th className="border px-2 py-1">현 잔액</th>
                  </tr>
                </thead>
                <tbody>
                  {branches2.map((branch, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-2 py-1 text-xs">{branch}</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                    </tr>
                  ))}
                  <tr className="font-semibold bg-gray-100">
                    <td className="border px-2 py-1 text-xs">Total</td>
                    <td className="border px-2 py-1 text-right">-</td>
                    <td className="border px-2 py-1 text-right">-</td>
                    <td className="border px-2 py-1 text-right">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: 자금 현황 */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">Section 3: 자금 현황 (Funds Status) <span className="text-sm font-normal text-gray-500">단위(원)</span></h2>
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1" rowSpan={2}>구분</th>
                <th className="border px-2 py-1" rowSpan={2}>보통예금</th>
                <th className="border px-2 py-1" colSpan={3}>어음</th>
                <th className="border px-2 py-1" rowSpan={2}>적금+보험</th>
                <th className="border px-2 py-1" rowSpan={2}>CMA<br/>(미래에셋,대신증권)</th>
                <th className="border px-2 py-1" colSpan={1}>외화정기예금</th>
                <th className="border px-2 py-1" colSpan={2}>외화예금</th>
                <th className="border px-2 py-1" colSpan={1}>외화보통예금</th>
                <th className="border px-2 py-1" rowSpan={2}>한도대출잔액</th>
                <th className="border px-2 py-1" rowSpan={2}>단기차입금</th>
                <th className="border px-2 py-1" rowSpan={2}>장기차입금</th>
                <th className="border px-2 py-1" rowSpan={2}>퇴직연금</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border px-1 py-1 text-xs">전자어음</th>
                <th className="border px-1 py-1 text-xs">외담대</th>
                <th className="border px-1 py-1 text-xs">받을어음</th>
                <th className="border px-1 py-1 text-xs">USD</th>
                <th className="border px-1 py-1 text-xs">EUR</th>
                <th className="border px-1 py-1 text-xs">JPY</th>
                <th className="border px-1 py-1 text-xs">USD</th>
              </tr>
            </thead>
            <tbody>
              {['전잔', '당입', '지출', '현잔'].map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-2 py-1 font-medium bg-gray-50">{row}</td>
                  <td className="border px-2 py-1 text-right">-</td>
                  <td className="border px-2 py-1 text-right">-</td>
                  <td className="border px-2 py-1 text-right">-</td>
                  <td className="border px-2 py-1 text-right">-</td>
                  <td className="border px-2 py-1 text-right">-</td>
                  <td className="border px-2 py-1 text-right">-</td>
                  <td className="border px-2 py-1 text-right">-</td>
                  <td className="border px-2 py-1 text-right">-</td>
                  <td className="border px-2 py-1 text-right">-</td>
                  <td className="border px-2 py-1 text-right">-</td>
                  <td className="border px-2 py-1 text-right">-</td>
                  <td className="border px-2 py-1 text-right">-</td>
                  <td className="border px-2 py-1 text-right">-</td>
                  <td className="border px-2 py-1 text-right">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4: 주요입금현황 */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">Section 4: 주요입금현황 (Major Deposits/Payments)</h2>
        <div className="grid grid-cols-3 gap-4">
          {['카드', '어음', '현금'].map((type) => (
            <div key={type}>
              <h3 className="text-sm font-semibold mb-2 bg-purple-100 p-2">{type}</h3>
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1">입금처</th>
                      <th className="border px-2 py-1">금액</th>
                      <th className="border px-2 py-1">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((row) => (
                      <tr key={row} className="hover:bg-gray-50">
                        <td className="border px-2 py-1">-</td>
                        <td className="border px-2 py-1 text-right">-</td>
                        <td className="border px-2 py-1">-</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: 주요비용 지출현황 */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">Section 5: 주요비용 지출현황 (Major Expense Disbursements)</h2>
        <div className="grid grid-cols-3 gap-4">
          {['카드', '어음', '현금'].map((type) => (
            <div key={type}>
              <h3 className="text-sm font-semibold mb-2 bg-orange-100 p-2">{type}</h3>
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1">지출처</th>
                      <th className="border px-2 py-1">금액</th>
                      <th className="border px-2 py-1">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((row) => (
                      <tr key={row} className="hover:bg-gray-50">
                        <td className="border px-2 py-1">-</td>
                        <td className="border px-2 py-1 text-right">-</td>
                        <td className="border px-2 py-1">-</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 6: 모빌결제내역 */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">Section 6: 모빌결제내역 (Mobil Payment Details)</h2>
        <div className="mb-2 text-xs text-gray-500 bg-yellow-50 p-2 rounded">
          Note: This data should come from ERP, but may also arrive via Nateon mail service. See REF. 발주서.
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* 일계 (Daily) */}
          <div>
            <h3 className="text-sm font-semibold mb-2 bg-red-100 p-2">일계 (Daily)</h3>
            <div className="mb-2 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">전일잔액: -</div>
              <div className="bg-gray-50 p-2 rounded">결제금액: -</div>
            </div>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">사무소/구분</th>
                    <th className="border px-2 py-1">IL</th>
                    <th className="border px-2 py-1">AUTO</th>
                    <th className="border px-2 py-1">MBK</th>
                  </tr>
                </thead>
                <tbody>
                  {mobilBranches.map((branch, idx) => (
                    <tr key={idx} className={`hover:bg-gray-50 ${branch === 'Total' || branch === '잔액' ? 'font-semibold bg-gray-50' : ''}`}>
                      <td className="border px-2 py-1 text-xs">{branch}</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                      <td className="border px-2 py-1 text-right">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 누계 (Monthly Cumulative) */}
          <div>
            <h3 className="text-sm font-semibold mb-2 bg-red-100 p-2">누계 (Monthly Cumulative)</h3>
            <div className="mb-2 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">전일잔액: -</div>
              <div className="bg-gray-50 p-2 rounded">결제금액: -</div>
            </div>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">사무소/구분</th>
                    <th className="border px-2 py-1">금액</th>
                  </tr>
                </thead>
                <tbody>
                  {mobilBranches.map((branch, idx) => (
                    <tr key={idx} className={`hover:bg-gray-50 ${branch === 'Total' || branch === '잔액' ? 'font-semibold bg-gray-50' : ''}`}>
                      <td className="border px-2 py-1 text-xs">{branch}</td>
                      <td className="border px-2 py-1 text-right">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 p-4 bg-gray-100 rounded text-sm text-gray-600">
        <p>📊 This is a placeholder UI showing the structure of the 일보현황 report.</p>
        <p className="mt-2">Data will be populated from Excel files in the next phase.</p>
      </div>
    </div>
  );
}
