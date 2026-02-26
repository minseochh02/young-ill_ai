import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const tab = searchParams.get('tab') || 'tab2';

  const validTabs = ['tab2', 'tab3', 'tab4', 'tab5', 'tab6', 'tab7', 'tab8', 'tab9', 'tab10', 'tab11', 'tab12'];

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
      data: [],
    };

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
