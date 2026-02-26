'use client';

import React, { useEffect, useState } from 'react';
import { queryTable } from '../../../egdesk-helpers';
import { TABLES } from '../../../egdesk.config';

interface SaleData {
  id: number;
  일자: string;
  판매처명: string;
  품목명_규격_: string;
  수량: number;
  단가: number;
  공급가액: number;
  합_계: number;
}

export default function TestDBPage() {
  const [salesData, setSalesData] = useState<SaleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);

        console.log('🔍 Fetching from table:', TABLES.table1.name);
        console.log('📊 Table display name:', TABLES.table1.displayName);

        // Use egdesk-helpers to query the database via the proxy
        const result = await queryTable(TABLES.table1.name, {
          limit: 20,
          orderBy: '일자',
          orderDirection: 'DESC'
        });

        console.log('✅ Query result:', result);

        if (result && result.rows) {
          setSalesData(result.rows);
        } else {
          setError('No data returned from query');
        }

      } catch (err: any) {
        setError(`Failed to fetch sales data: ${err.message}`);
        console.error('❌ Failed to fetch sales data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Database Test - 판매현황</h1>
        <p>Loading data from SQLite via Next.js middleware proxy...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Database Test - 판매현황</h1>
        <div style={{
          padding: '15px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          marginTop: '10px'
        }}>
          <strong>Error:</strong> {error}
        </div>
        <div style={{ marginTop: '20px' }}>
          <h3>Debug Info:</h3>
          <pre style={{
            padding: '10px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {JSON.stringify({
              tableName: TABLES.table1.name,
              displayName: TABLES.table1.displayName,
              columns: TABLES.table1.columns
            }, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Database Test - {TABLES.table1.displayName}</h1>
      <p>
        <strong>✅ Successfully connected to SQLite database!</strong>
      </p>
      <p style={{ color: '#666', fontSize: '14px' }}>
        Fetched {salesData.length} rows from table: {TABLES.table1.name}
      </p>

      {salesData.length === 0 ? (
        <p>No sales data found.</p>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #ddd'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#f5f5f5',
                borderBottom: '2px solid #ddd'
              }}>
                <th style={{ padding: '12px', textAlign: 'left', borderRight: '1px solid #ddd' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left', borderRight: '1px solid #ddd' }}>일자</th>
                <th style={{ padding: '12px', textAlign: 'left', borderRight: '1px solid #ddd' }}>판매처명</th>
                <th style={{ padding: '12px', textAlign: 'left', borderRight: '1px solid #ddd' }}>품목명 (규격)</th>
                <th style={{ padding: '12px', textAlign: 'right', borderRight: '1px solid #ddd' }}>수량</th>
                <th style={{ padding: '12px', textAlign: 'right', borderRight: '1px solid #ddd' }}>단가</th>
                <th style={{ padding: '12px', textAlign: 'right', borderRight: '1px solid #ddd' }}>공급가액</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>합계</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((sale) => (
                <tr key={sale.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', borderRight: '1px solid #eee' }}>{sale.id}</td>
                  <td style={{ padding: '10px', borderRight: '1px solid #eee' }}>{sale.일자}</td>
                  <td style={{ padding: '10px', borderRight: '1px solid #eee' }}>{sale.판매처명}</td>
                  <td style={{ padding: '10px', borderRight: '1px solid #eee' }}>{sale.품목명_규격_}</td>
                  <td style={{ padding: '10px', textAlign: 'right', borderRight: '1px solid #eee' }}>
                    {sale.수량?.toLocaleString() || 'N/A'}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', borderRight: '1px solid #eee' }}>
                    ₩{sale.단가?.toLocaleString() || 'N/A'}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', borderRight: '1px solid #eee' }}>
                    ₩{sale.공급가액?.toLocaleString() || 'N/A'}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>
                    ₩{sale.합_계?.toLocaleString() || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '4px'
      }}>
        <h3>How it works:</h3>
        <ol style={{ lineHeight: '1.8' }}>
          <li>Client component calls <code>queryTable()</code> from egdesk-helpers.ts</li>
          <li>Helper makes a fetch to <code>__user_data_proxy</code></li>
          <li>Next.js middleware.ts intercepts the request</li>
          <li>Middleware forwards to localhost:8080/user-data/tools/call</li>
          <li>EGDesk MCP server queries SQLite database</li>
          <li>Response flows back through middleware to client</li>
        </ol>
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          ✅ No CORS issues - works in both local and tunneled environments!
        </p>
      </div>
    </div>
  );
}
