import { NextRequest, NextResponse } from 'next/server';
import type { Report01IlboData } from '@/types/api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  try {
    const data: Report01IlboData = {
      date,
      salesStatus: {
        daily: [],
        monthlyCumulative: [],
      },
      arStatus: {
        daily: [],
        monthlyCumulative: [],
        arBalance: [],
      },
      fundsStatus: [],
      majorDeposits: {
        card: [],
        notes: [],
        cash: [],
      },
      majorExpenses: {
        card: [],
        notes: [],
        cash: [],
      },
      mobilPaymentDetails: {
        daily: {
          previousDayBalance: 0,
          paymentAmount: 0,
          branches: [],
        },
        monthlyCumulative: {
          previousDayBalance: 0,
          paymentAmount: 0,
          branches: [],
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
