import { NextRequest, NextResponse } from 'next/server';
import type { Report02DailySalesData, Branch02DailySales } from '@/types/api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const branch = searchParams.get('branch') || '화성IL';

  const validBranches: Branch02DailySales[] = [
    '화성IL',
    '창원',
    '화성auto(남부)',
    '화성auto(중부)',
    '인천(서부)',
    '남양주(동부)',
    '제주',
    '부산'
  ];

  if (!validBranches.includes(branch as Branch02DailySales)) {
    return NextResponse.json(
      { success: false, error: 'Invalid branch specified' },
      { status: 400 }
    );
  }

  try {
    const data: Report02DailySalesData = {
      date,
      branch: branch as Branch02DailySales,
      salesStatus: [],
      collectionsStatus: {
        cash: 0,
        notes: 0,
        card: 0,
        total: 0,
      },
      purchasesOrders: [],
      inventory: [],
      keyStatus: [],
      newCompanies: [],
    };

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
