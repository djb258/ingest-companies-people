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
    console.log('🚀 Starting Google Sheets import for URL:', url);
    
    // Validate URL format
    if (!url.includes('docs.google.com/spreadsheets')) {
      console.error('❌ URL validation failed - not a Google Sheets URL');
      return {
        data: [],
        error: 'Please provide a valid Google Sheets URL'
      };
    }
    
    // Extract sheet ID from various Google Sheets URL formats
    const sheetIdMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    
    if (!sheetIdMatch) {
      console.error('❌ Failed to extract sheet ID from URL');
      return {
        data: [],
        error: 'Invalid Google Sheets URL. Please make sure you\'re using a valid Google Sheets link.'
      };
    }

    const sheetId = sheetIdMatch[1];
    console.log('✅ Extracted Sheet ID:', sheetId);
    
    // Extract gid (sheet tab ID) if present
    const gidMatch = url.match(/[#&]gid=([0-9]+)/);
    const gid = gidMatch ? gidMatch[1] : '0';
    console.log('✅ Using GID:', gid);
    
    // Try multiple URL formats for better compatibility
    const csvUrls = [
      `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`,
      `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`,
      `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`
    ];
    
    let lastError = '';
    
    for (let i = 0; i < csvUrls.length; i++) {
      const csvUrl = csvUrls[i];
      console.log(`🔄 Attempt ${i + 1}/${csvUrls.length} - Trying URL:`, csvUrl);
      
      try {
        const response = await fetch(csvUrl, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'text/csv,application/csv,text/plain,*/*'
          }
        });
        
        console.log(`📊 Response status: ${response.status} (${response.statusText})`);
        console.log(`📊 Response type:`, response.type);
        
        if (response.ok) {
          const csvText = await response.text();
          console.log(`✅ Received CSV data, length: ${csvText.length} characters`);
          console.log(`📝 First 100 chars:`, csvText.substring(0, 100));
          
          if (csvText && csvText.trim().length > 0) {
            // Parse CSV using Papa Parse
            return new Promise((resolve) => {
              Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                  console.log('🎉 CSV parsing complete');
                  console.log(`📊 Parsed ${result.data.length} records`);
                  
                  if (result.errors.length > 0) {
                    console.warn('⚠️ Parse warnings:', result.errors);
                  }
                  
                  resolve({ data: result.data as Record<string, any>[] });
                },
                error: (error) => {
                  console.error('❌ Papa Parse error:', error);
                  resolve({
                    data: [],
                    error: `CSV parsing failed: ${error.message}`
                  });
                }
              });
            });
          } else {
            console.error('❌ Empty CSV response received');
            lastError = 'Empty response from Google Sheets';
          }
        } else {
          console.error(`❌ HTTP ${response.status}: ${response.statusText}`);
          
          // Try to read error response
          try {
            const errorText = await response.text();
            console.error('❌ Error response body:', errorText.substring(0, 200));
            lastError = `HTTP ${response.status}: ${response.statusText}`;
          } catch (e) {
            console.error('❌ Could not read error response');
            lastError = `HTTP ${response.status}: ${response.statusText}`;
          }
        }
        
      } catch (fetchError) {
        console.error(`❌ Fetch error for attempt ${i + 1}:`, fetchError);
        lastError = fetchError instanceof Error ? fetchError.message : 'Network error';
      }
    }
    
    // All attempts failed
    console.error('❌ All import attempts failed');
    return {
      data: [],
      error: `Google Sheets import failed: ${lastError}

Make sure your sheet is properly shared:
1. Open your Google Sheet
2. Click "Share" (top right corner)  
3. Change from "Restricted" to "Anyone with the link"
4. Set permission to "Viewer"
5. Copy the sharing link and try again

Current error: ${lastError}`
    };
    
  } catch (error) {
    console.error('❌ Unexpected error during Google Sheets import:', error);
    return {
      data: [],
      error: `Import failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
    };
  }
};