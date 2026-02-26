/**
 * API utility functions for fetching operation data
 *
 * IMPORTANT: This file uses apiFetch() wrapper to handle EGDesk basePath
 * DO NOT use bare fetch() - it will return 404 in EGDesk tunnel
 *
 * See EGDESK-README.md for more information about this requirement.
 */

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Base fetch wrapper that automatically prepends the EGDesk basePath
 * This is required for client-side fetch calls to work in EGDesk tunnel
 *
 * @param path - The API path (e.g., '/api/operations/01-ilbo')
 * @param options - Optional fetch options
 * @returns Promise<Response>
 */
const basePath = process.env.NEXT_PUBLIC_EGDESK_BASE_PATH || '';

export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  // Automatically prepend basePath to relative URLs
  const url = path.startsWith('/') && !path.startsWith('//')
    ? `${basePath}${path}`
    : path;
  return fetch(url, options);
}

/**
 * Fetch 일보현황 (Daily Report) data
 * @param date - Date in YYYY-MM-DD format
 */
export async function fetch01IlboData(date: string) {
  try {
    const response = await apiFetch(`/api/operations/01-ilbo?date=${date}`);
    const result: ApiResponse<any> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch data');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching 01-ilbo data:', error);
    throw error;
  }
}

/**
 * Fetch 일일매출수금현황 (Branch Daily Sales & Collections) data
 * @param date - Date in YYYY-MM-DD format
 * @param branch - Branch name
 */
export async function fetch02DailySalesData(date: string, branch: string) {
  try {
    const response = await apiFetch(
      `/api/operations/02-daily-sales?date=${date}&branch=${encodeURIComponent(branch)}`
    );
    const result: ApiResponse<any> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch data');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching 02-daily-sales data:', error);
    throw error;
  }
}

/**
 * Fetch 재고파악시트 (Inventory Tracking) data
 * @param date - Date in YYYY-MM-DD format
 * @param branch - Branch name
 */
export async function fetch03InventoryData(date: string, branch: string) {
  try {
    const response = await apiFetch(
      `/api/operations/03-inventory?date=${date}&branch=${encodeURIComponent(branch)}`
    );
    const result: ApiResponse<any> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch data');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching 03-inventory data:', error);
    throw error;
  }
}

/**
 * Fetch 장기재고현황 (Long-term Inventory) data
 * @param date - Date in YYYY-MM-DD format
 * @param branch - Branch name
 */
export async function fetch04LongtermInventoryData(date: string, branch: string) {
  try {
    const response = await apiFetch(
      `/api/operations/04-longterm-inventory?date=${date}&branch=${encodeURIComponent(branch)}`
    );
    const result: ApiResponse<any> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch data');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching 04-longterm-inventory data:', error);
    throw error;
  }
}

// Export all functions as a group for easier imports
export const operationsApi = {
  ilbo: fetch01IlboData,
  dailySales: fetch02DailySalesData,
  inventory: fetch03InventoryData,
  longtermInventory: fetch04LongtermInventoryData,
};
