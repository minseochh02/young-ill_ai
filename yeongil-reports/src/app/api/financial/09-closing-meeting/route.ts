import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const tab = searchParams.get('tab') || 'actual';

  const validTabs = ['actual', 'plan'];

  if (!validTabs.includes(tab)) {
    return NextResponse.json(
      { success: false, error: 'Invalid tab specified' },
      { status: 400 }
    );
  }

  try {
    const data = {
      date,
      activeTab: tab,
      performanceData: {},
      purchaseSalesSummary: {},
    };

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
