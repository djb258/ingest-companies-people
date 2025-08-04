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