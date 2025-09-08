import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface ParseResult {
  data: Record<string, any>[];
  error?: string;
}

export const parseFile = (file: File): Promise<ParseResult> => {
  return new Promise((resolve) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (extension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          if (result.errors.length > 0) {
            resolve({ 
              data: [], 
              error: `CSV parsing error: ${result.errors[0].message}` 
            });
          } else {
            resolve({ data: result.data as Record<string, any>[] });
          }
        },
        error: (error) => {
          resolve({ 
            data: [], 
            error: `Failed to parse CSV: ${error.message}` 
          });
        }
      });
    } else if (extension === 'json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          
          // Ensure it's an array
          const data = Array.isArray(parsed) ? parsed : [parsed];
          resolve({ data });
        } catch (error) {
          resolve({ 
            data: [], 
            error: `Invalid JSON format: ${error instanceof Error ? error.message : 'Unknown error'}` 
          });
        }
      };
      reader.onerror = () => {
        resolve({ 
          data: [], 
          error: 'Failed to read JSON file' 
        });
      };
      reader.readAsText(file);
    } else if (extension === 'xlsx' || extension === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first sheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve({ data: jsonData as Record<string, any>[] });
        } catch (error) {
          resolve({ 
            data: [], 
            error: `Excel parsing error: ${error instanceof Error ? error.message : 'Unknown error'}` 
          });
        }
      };
      reader.onerror = () => {
        resolve({ 
          data: [], 
          error: 'Failed to read Excel file' 
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
      resolve({ 
        data: [], 
        error: 'Unsupported file format. Please upload CSV, JSON, or Excel files.' 
      });
    }
  });
};

export const parseGoogleSheetUrl = async (url: string): Promise<ParseResult> => {
  try {
    // Extract sheet ID from various Google Sheets URL formats
    const sheetIdMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    
    if (!sheetIdMatch) {
      return {
        data: [],
        error: 'Invalid Google Sheets URL. Please make sure you\'re using a valid Google Sheets link.'
      };
    }

    const sheetId = sheetIdMatch[1];
    
    // Extract gid (sheet tab ID) if present
    const gidMatch = url.match(/[#&]gid=([0-9]+)/);
    const gid = gidMatch ? gidMatch[1] : '0';
    
    // Create CSV export URL
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    
    // Fetch the CSV data
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      if (response.status === 403) {
        return {
          data: [],
          error: 'Access denied. Please make sure the Google Sheet is publicly accessible or shared with "Anyone with the link".'
        };
      }
      return {
        data: [],
        error: `Failed to fetch Google Sheet data: ${response.statusText}`
      };
    }
    
    const csvText = await response.text();
    
    // Parse CSV using Papa Parse
    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          if (result.errors.length > 0) {
            resolve({
              data: [],
              error: `Google Sheets parsing error: ${result.errors[0].message}`
            });
          } else {
            resolve({ data: result.data as Record<string, any>[] });
          }
        },
        error: (error) => {
          resolve({
            data: [],
            error: `Failed to parse Google Sheets data: ${error.message}`
          });
        }
      });
    });
    
  } catch (error) {
    return {
      data: [],
      error: `Failed to import Google Sheet: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};