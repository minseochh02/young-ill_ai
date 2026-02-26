import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const branch = searchParams.get('branch') || '화성';

  const validBranches = ['화성', '창원', '부산', '동부', '서부', '중부', '제주'];

  if (!validBranches.includes(branch)) {
    return NextResponse.json(
      { success: false, error: 'Invalid branch specified' },
      { status: 400 }
    );
  }

  try {
    const data = {
      date,
      branch,
      inactiveCustomers: [],
      summary: {
        totalInactiveCustomers: 0,
        totalBalance: 0,
        byCategory: {
          b2b: 0,
          b2c: 0,
          dealer: 0,
        },
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
