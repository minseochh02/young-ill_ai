import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const branch = searchParams.get('branch') || '화성';
  const tab = searchParams.get('tab') || 'tab1';

  const validBranches = ['화성', '창원', '남양주', '인천', '화성오토', '제주', '부산'];
  const validTabs = ['tab1', 'tab3', 'tab4', 'tab5'];

  if (!validBranches.includes(branch)) {
    return NextResponse.json(
      { success: false, error: 'Invalid branch specified' },
      { status: 400 }
    );
  }

  if (!validTabs.includes(tab)) {
    return NextResponse.json(
      { success: false, error: 'Invalid tab specified' },
      { status: 400 }
    );
  }

  try {
    const data = {
      date,
      branch,
      activeTab: tab,
      salesTransactions: [],
      inventorySnapshot: [],
      unsoldOrders: [],
      unreceivedOrders: [],
    };

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
