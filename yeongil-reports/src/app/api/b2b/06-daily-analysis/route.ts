import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  try {
    const data = {
      date,
      branches: [],
      totals: {
        qty: 0,
        supply: 0,
        profitDSP: 0,
        profitASP: 0,
        rateDSP: 0,
        rateASP: 0,
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
