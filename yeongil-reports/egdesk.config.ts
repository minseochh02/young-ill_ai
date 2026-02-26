/**
 * EGDesk User Data Configuration
 * Generated at: 2026-02-26T07:58:03.760Z
 *
 * This file contains type-safe definitions for your EGDesk tables.
 */

export const EGDESK_CONFIG = {
  apiUrl: 'http://localhost:8080',
  apiKey: '5299821c-9fad-47df-9a38-c2d4c1d469ff',
} as const;

export interface TableDefinition {
  name: string;
  displayName: string;
  description?: string;
  rowCount: number;
  columnCount: number;
  columns: string[];
}

export const TABLES = {
  table1: {
    name: 'promissory_note_balance',
    displayName: '어음지출',
    description: undefined,
    rowCount: 41,
    columnCount: 10,
    columns: ['id', '일자', '일자_번호', '거래처그룹1명', '사업자번호', '어음번호', '거래처명', '계정명', '적요', '금액']
  } as TableDefinition,
  table2: {
    name: 'promissory_note',
    displayName: '어음거래',
    description: undefined,
    rowCount: 35,
    columnCount: 11,
    columns: ['id', '일자', '일자_번호', '거래처그룹1명', '어음번호', '사업자번호', '거래처명', '계정명', '적요', '만기일자', '금액']
  } as TableDefinition,
  table3: {
    name: 'deposit',
    displayName: '입금현황',
    description: undefined,
    rowCount: 662,
    columnCount: 15,
    columns: ['id', '전표번호', '계좌', '돈들어온계좌번호', '계정명', '부서명', '거래처코드', '거래처명', '적요', '금액', '수수료', '담당자명', '프로젝트명', '세무신고거래처', '대표자명']
  } as TableDefinition,
  table4: {
    name: 'purchases',
    displayName: '구매현황',
    description: undefined,
    rowCount: 1757,
    columnCount: 22,
    columns: ['id', '일자', '거래처코드', '거래처그룹1명', '구매처명', '창고명', '품목코드', '품목명', '단위', '규격_규격명', '수량', '중량', '단가', '공급가액', '합_계', '적요', '적요1', '적요2', '품목그룹1명', '품목그룹1코드', '품목그룹2명', '품목그룹3코드']
  } as TableDefinition,
  table5: {
    name: 'sales',
    displayName: '판매현황',
    description: undefined,
    rowCount: 7006,
    columnCount: 26,
    columns: ['id', '일자', '거래처그룹1코드명', '세무신고거래처코드', '거래처코드', '담당자코드명', '판매처명', '품목코드', '품목명_규격_', '단위', '규격명', '수량', '중량', '단가', '공급가액', '합_계', '품목그룹1코드', '품목그룹2명', '품목그룹3코드', '창고명', '거래처그룹2명', '신규일', '적요', '적요2', '코드변경', '실납업체']
  } as TableDefinition
} as const;


// Main table (first table by default)
export const MAIN_TABLE = TABLES.table1;


// Helper to get table by name
export function getTableByName(tableName: string): TableDefinition | undefined {
  return Object.values(TABLES).find(t => t.name === tableName);
}

// Export table names for easy access
export const TABLE_NAMES = {
  table1: 'promissory_note_balance',
  table2: 'promissory_note',
  table3: 'deposit',
  table4: 'purchases',
  table5: 'sales'
} as const;
