import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const view = searchParams.get('view') || 'summary';

  const validViews = ['summary', '화성', '창원', '부산', '동부', '서부', '중부', '제주'];

  if (!validViews.includes(view)) {
    return NextResponse.json(
      { success: false, error: 'Invalid view specified' },
      { status: 400 }
    );
  }

  try {
    const data = view === 'summary' ? {
      date,
      view: 'summary',
      section1: {
        arStatus: [],
        totals: {
          currentMonthTotalAR: 0,
          longtermAR: 0,
          longtermARRatio: '0',
          previousMonthLongtermAR: 0,
          changeFromPrevious: 0,
        },
      },
      section2: {
        overdueCompanies: [],
        totals: {
          currentMonthLongtermAR: 0,
          previousMonthLongtermAR: 0,
          changeFromPrevious: 0,
        },
      },
      section3: [],
    } : {
      date,
      view,
      branch: view,
      detailedCustomers: [],
      summary: {
        totalCustomers: 0,
        totalCarryover: 0,
        totalCurrent: 0,
      },
    };

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
