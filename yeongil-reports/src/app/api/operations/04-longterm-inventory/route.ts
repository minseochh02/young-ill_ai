import { NextRequest, NextResponse } from 'next/server';
import type { Report04LongtermInventoryData, Branch04Longterm } from '@/types/api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const branch = searchParams.get('branch') || '화성';

  const validBranches: Branch04Longterm[] = ['화성', '창원', '동부', '서부', '제주'];

  if (!validBranches.includes(branch as Branch04Longterm)) {
    return NextResponse.json(
      { success: false, error: 'Invalid branch specified' },
      { status: 400 }
    );
  }

  try {
    const data: Report04LongtermInventoryData = {
      date,
      branch: branch as Branch04Longterm,
      slowMovingStock: [],
      summary: {
        totalItems: 0,
        totalVolume: 0,
        byDivision: [],
        bySpecification: [],
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
