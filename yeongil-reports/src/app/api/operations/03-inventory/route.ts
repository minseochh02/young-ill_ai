import { NextRequest, NextResponse } from 'next/server';
import type { Report03InventoryData, Branch03Inventory } from '@/types/api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const branch = searchParams.get('branch') || '통합';

  const validBranches: Branch03Inventory[] = [
    '통합',
    '화성(서울)',
    '창원',
    '남양주',
    '인천',
    '화성오토',
    '제주',
    '부산'
  ];

  if (!validBranches.includes(branch as Branch03Inventory)) {
    return NextResponse.json(
      { success: false, error: 'Invalid branch specified' },
      { status: 400 }
    );
  }

  try {
    const data: Report03InventoryData = {
      date,
      branch: branch as Branch03Inventory,
      inventoryTracking: {
        openingInventory: [],
        purchases: [],
        sales: [],
        transfers: [],
        inventory: [],
      },
      total: {
        openingInventory: 0,
        purchases: 0,
        sales: 0,
        transfers: 0,
        inventory: 0,
      },
      eastBranchInventory: null,
      westBranchInventory: null,
      inventoryDMTotal: null,
    };

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
