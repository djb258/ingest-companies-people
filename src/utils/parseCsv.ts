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
    console.log('Parsing Google Sheets URL:', url);
    
    // Extract sheet ID from various Google Sheets URL formats
    const sheetIdMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    
    if (!sheetIdMatch) {
      console.error('Invalid Google Sheets URL format');
      return {
        data: [],
        error: 'Invalid Google Sheets URL. Please make sure you\'re using a valid Google Sheets link.'
      };
    }

    const sheetId = sheetIdMatch[1];
    console.log('Extracted Sheet ID:', sheetId);
    
    // Extract gid (sheet tab ID) if present
    const gidMatch = url.match(/[#&]gid=([0-9]+)/);
    const gid = gidMatch ? gidMatch[1] : '0';
    console.log('Using GID:', gid);
    
    // Create CSV export URL
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    console.log('CSV Export URL:', csvUrl);
    
    // Fetch the CSV data with proper headers
    const response = await fetch(csvUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'text/csv,application/csv,text/plain,*/*'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      
      // Try alternative URL format for 400 errors
      if (response.status === 400) {
        console.log('Trying alternative URL format...');
        const altCsvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
        console.log('Alternative CSV URL:', altCsvUrl);
        
        try {
          const altResponse = await fetch(altCsvUrl, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Accept': 'text/csv,application/csv,text/plain,*/*'
            }
          });
          
          if (altResponse.ok) {
            const altCsvText = await altResponse.text();
            console.log('Alternative URL worked, CSV length:', altCsvText.length);
            
            if (altCsvText && altCsvText.trim().length > 0) {
              // Parse CSV using Papa Parse
              return new Promise((resolve) => {
                Papa.parse(altCsvText, {
                  header: true,
                  skipEmptyLines: true,
                  complete: (result) => {
                    console.log('Google Sheets import successful:', result.data.length, 'records');
                    resolve({ data: result.data, error: null });
                  },
                  error: (error) => {
                    console.error('CSV parsing error:', error);
                    resolve({ 
                      data: [], 
                      error: `Failed to parse CSV data: ${error.message}` 
                    });
                  }
                });
              });
            }
          }
        } catch (altError) {
          console.warn('Alternative URL also failed:', altError);
        }
      }
      
      if (response.status === 403) {
        return {
          data: [],
          error: `Access denied. Please make sure the Google Sheet is shared properly:

1. Open your Google Sheet
2. Click "Share" button (top right)
3. Change "Restricted" to "Anyone with the link"
4. Make sure permission is set to "Viewer"
5. Copy the new link and try again`
        };
      }
      if (response.status === 404) {
        return {
          data: [],
          error: 'Google Sheet not found. Please check the URL and make sure the sheet exists.'
        };
      }
      if (response.status === 400) {
        return {
          data: [],
          error: `Bad request (400). This usually means the sheet isn't properly shared. Please:

1. Make sure the sheet is shared as "Anyone with the link can view"
2. Check that the URL is complete and correct
3. Try sharing the sheet again and copying a fresh link`
        };
      }
      return {
        data: [],
        error: `Failed to fetch Google Sheet data: ${response.status} ${response.statusText}`
      };
    }
    
    const csvText = await response.text();
    console.log('CSV content length:', csvText.length);
    console.log('First 200 chars of CSV:', csvText.substring(0, 200));
    
    if (!csvText || csvText.trim().length === 0) {
      return {
        data: [],
        error: 'Google Sheet appears to be empty or inaccessible.'
      };
    }
    
    // Parse CSV using Papa Parse
    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          console.log('Papa Parse result:', result);
          if (result.errors.length > 0) {
            console.error('Papa Parse errors:', result.errors);
            resolve({
              data: [],
              error: `Google Sheets parsing error: ${result.errors[0].message}`
            });
          } else {
            console.log('Successfully parsed', result.data.length, 'records');
            resolve({ data: result.data as Record<string, any>[] });
          }
        },
        error: (error) => {
          console.error('Papa Parse error:', error);
          resolve({
            data: [],
            error: `Failed to parse Google Sheets data: ${error.message}`
          });
        }
      });
    });
    
  } catch (error) {
    console.error('Google Sheets import error:', error);
    return {
      data: [],
      error: `Failed to import Google Sheet: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};