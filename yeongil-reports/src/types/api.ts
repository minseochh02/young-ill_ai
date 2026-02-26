/**
 * TypeScript type definitions for Operations API responses
 */

// Common types
export type DateString = string; // Format: YYYY-MM-DD

// Branch types
export type Branch01Ilbo =
  | '서울/화성IL'
  | '창원'
  | '화성auto(남부)'
  | '화성auto(중부)'
  | '인천(서부)'
  | '남양주(동부)'
  | '제주'
  | '부산';

export type Branch02DailySales =
  | '화성IL'
  | '창원'
  | '화성auto(남부)'
  | '화성auto(중부)'
  | '인천(서부)'
  | '남양주(동부)'
  | '제주'
  | '부산';

export type Branch03Inventory =
  | '통합'
  | '화성(서울)'
  | '창원'
  | '남양주'
  | '인천'
  | '화성오토'
  | '제주'
  | '부산';

export type Branch04Longterm = '화성' | '창원' | '동부' | '서부' | '제주';

// Product types
export type ProductDivision = 'Auto' | 'IL' | 'MB' | 'AL' | '기타';
export type ProductType = 'Flagship' | 'Others';
export type SpecificationType = 'DM' | 'PL' | 'BOX' | 'EA';

// ==========================================
// 01. 일보현황 (Daily Report) Types
// ==========================================

export interface MobilSellData {
  total: number;
  flagship: number;
}

export interface SalesStatusBranch {
  branch: string;
  totalSalesAmount: number;
  mobilSellOut: MobilSellData;
  mobilSellIn: MobilSellData;
}

export interface SalesStatus {
  daily: SalesStatusBranch[];
  monthlyCumulative: SalesStatusBranch[];
}

export interface ARStatusBranch {
  branch: string;
  totalCollections: number;
  cash: number;
  notes: number;
  card: number;
  other: number;
}

export interface ARBalanceBranch {
  branch: string;
  previousMonthBalance: number;
  currentMonthSales: number;
  currentBalance: number;
}

export interface ARStatus {
  daily: ARStatusBranch[];
  monthlyCumulative: ARStatusBranch[];
  arBalance: ARBalanceBranch[];
}

export interface ForeignDeposit {
  usd: number;
  eur: number;
  jpy: number;
}

export interface FundsStatusRow {
  category: '전잔' | '당입' | '지출' | '현잔';
  regularDeposit: number;
  electronicNotes: number;
  foreignCurrency: number;
  savings: number;
  cma: number;
  foreignDeposit: ForeignDeposit;
  limitLoanBalance: number;
  shortTermLoan: number;
  longTermLoan: number;
  retirementFund: number;
}

export interface Transaction {
  source?: string;
  destination?: string;
  amount: number;
  description: string;
}

export interface MajorTransactions {
  card: Transaction[];
  notes: Transaction[];
  cash: Transaction[];
}

export interface MobilPaymentBranch {
  branch: string;
  il: number;
  auto: number;
  mbk: number;
}

export interface MobilPaymentBranchCumulative {
  branch: string;
  amount: number;
}

export interface MobilPaymentDetails {
  daily: {
    previousDayBalance: number;
    paymentAmount: number;
    branches: MobilPaymentBranch[];
  };
  monthlyCumulative: {
    previousDayBalance: number;
    paymentAmount: number;
    branches: MobilPaymentBranchCumulative[];
  };
}

export interface Report01IlboData {
  date: DateString;
  salesStatus: SalesStatus;
  arStatus: ARStatus;
  fundsStatus: FundsStatusRow[];
  majorDeposits: MajorTransactions;
  majorExpenses: MajorTransactions;
  mobilPaymentDetails: MobilPaymentDetails;
}

// ==========================================
// 02. 일일매출수금현황 (Branch Daily Sales) Types
// ==========================================

export interface BrandSales {
  brand: string;
  previousDayCumulative: number;
  today: number;
  cumulative: number;
  remarks: string;
}

export interface CollectionsStatus {
  cash: number;
  notes: number;
  card: number;
  total: number;
}

export interface PurchaseOrder {
  category: string;
  volume: number;
  amount: number | null;
}

export interface InventoryItem {
  brand: string;
  previousDay: number;
  incoming: number;
  outgoing: number;
  current: number;
}

export interface KeyStatusItem {
  date: DateString;
  company: string;
  amount: number;
  remarks: string;
}

export interface NewCompany {
  date: DateString;
  company: string;
  location: string;
  remarks: string;
}

export interface Report02DailySalesData {
  date: DateString;
  branch: Branch02DailySales;
  salesStatus: BrandSales[];
  collectionsStatus: CollectionsStatus;
  purchasesOrders: PurchaseOrder[];
  inventory: InventoryItem[];
  keyStatus: KeyStatusItem[];
  newCompanies: NewCompany[];
}

// ==========================================
// 03. 재고파악시트 (Inventory Tracking) Types
// ==========================================

export interface InventoryProduct {
  division: ProductDivision;
  type: ProductType;
  value: number;
}

export interface InventoryTracking {
  openingInventory: InventoryProduct[];
  purchases: InventoryProduct[];
  sales: InventoryProduct[];
  transfers: InventoryProduct[];
  inventory: InventoryProduct[];
}

export interface InventoryTotal {
  openingInventory: number;
  purchases: number;
  sales: number;
  transfers: number;
  inventory: number;
}

export interface Report03InventoryData {
  date: DateString;
  branch: Branch03Inventory;
  inventoryTracking: InventoryTracking;
  total: InventoryTotal;
  eastBranchInventory: InventoryProduct[] | null;
  westBranchInventory: InventoryProduct[] | null;
  inventoryDMTotal: InventoryProduct[] | null;
}

// ==========================================
// 04. 장기재고현황 (Long-term Inventory) Types
// ==========================================

export interface SlowMovingStockItem {
  division: ProductDivision | null;
  productName: string | null;
  specification: SpecificationType | null;
  previousMonthInventory: number | null;
}

export interface DivisionSummary {
  division: ProductDivision;
  count: number;
  volume: number;
}

export interface SpecificationSummary {
  specification: SpecificationType;
  count: number;
  volume: number;
}

export interface InventorySummary {
  totalItems: number;
  totalVolume: number;
  byDivision: DivisionSummary[];
  bySpecification: SpecificationSummary[];
}

export interface Report04LongtermInventoryData {
  date: DateString;
  branch: Branch04Longterm;
  slowMovingStock: SlowMovingStockItem[];
  summary: InventorySummary;
}

// ==========================================
// API Response Types
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type Report01IlboResponse = ApiResponse<Report01IlboData>;
export type Report02DailySalesResponse = ApiResponse<Report02DailySalesData>;
export type Report03InventoryResponse = ApiResponse<Report03InventoryData>;
export type Report04LongtermInventoryResponse = ApiResponse<Report04LongtermInventoryData>;
