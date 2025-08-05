import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { uploadToRender } from '@/utils/uploadToRender';

export const ApiTester: React.FC = () => {
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const logWithTimestamp = (message: string) => {
    const timestamp = new Date().toISOString();
    setResponse(prev => prev + `[${timestamp}] ${message}\n`);
  };

  const logError = (context: string, error: any) => {
    logWithTimestamp(`❌ ERROR in ${context}:`);
    logWithTimestamp(`  Error type: ${error.constructor.name}`);
    logWithTimestamp(`  Error message: ${error.message}`);
    logWithTimestamp(`  Stack trace: ${error.stack}`);
    
    if (error.cause) {
      logWithTimestamp(`  Cause: ${error.cause}`);
    }
    
    if (error.response) {
      logWithTimestamp(`  Response status: ${error.response.status}`);
      logWithTimestamp(`  Response statusText: ${error.response.statusText}`);
    }
    
    logWithTimestamp('');
  };

  const testEndpoints = async () => {
    setIsLoading(true);
    setResponse('');
    
    const endpoint = 'https://render-marketing-db.onrender.com';
    
    logWithTimestamp('🚀 Starting comprehensive API endpoint testing...');
    logWithTimestamp(`Base endpoint: ${endpoint}`);
    logWithTimestamp('');

    // Test 1: Basic connectivity with detailed network info
    logWithTimestamp('📡 TEST 1: Basic connectivity');
    try {
      const startTime = performance.now();
      const basicResponse = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      });
      const endTime = performance.now();
      
      logWithTimestamp(`✅ Response time: ${(endTime - startTime).toFixed(2)}ms`);
      logWithTimestamp(`✅ Status: ${basicResponse.status} ${basicResponse.statusText}`);
      logWithTimestamp(`✅ Content-Type: ${basicResponse.headers.get('content-type')}`);
      logWithTimestamp(`✅ Server: ${basicResponse.headers.get('server') || 'Unknown'}`);
      
      const responseText = await basicResponse.text();
      logWithTimestamp(`✅ Response length: ${responseText.length} characters`);
      logWithTimestamp(`✅ Response preview: ${responseText.substring(0, 200)}...`);
      
    } catch (error) {
      logError('Basic connectivity test', error);
    }

    logWithTimestamp('');

    // Test 2: Insert endpoint with sample data
    logWithTimestamp('📊 TEST 2: Insert endpoint with sample company data');
    try {
      const testData = {
        records: [
          {
            company_name: 'Test Company API Debug',
            domain: 'test-debug.com',
            industry: 'Technology Testing',
            employee_count: 42,
            created_at: new Date().toISOString(),
            test_field: 'debug_value'
          }
        ],
        target_table: 'company.marketing_company'
      };

      logWithTimestamp(`📤 Sending payload: ${JSON.stringify(testData, null, 2)}`);
      
      const startTime = performance.now();
      const result = await uploadToRender(endpoint, testData);
      const endTime = performance.now();
      
      logWithTimestamp(`✅ Upload successful in ${(endTime - startTime).toFixed(2)}ms`);
      logWithTimestamp(`✅ Result: ${JSON.stringify(result, null, 2)}`);
      
    } catch (error) {
      logError('Insert endpoint test', error);
      
      // Try to get more details about the network error
      try {
        const directFetchTest = await fetch(`${endpoint}/insert`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            records: [{ test: 'direct_test' }],
            target_table: 'company.marketing_company'
          })
        });
        
        const responseText = await directFetchTest.text();
        logWithTimestamp(`📋 Direct fetch test - Status: ${directFetchTest.status}`);
        logWithTimestamp(`📋 Direct fetch test - Response: ${responseText}`);
        
      } catch (directError) {
        logError('Direct fetch test', directError);
      }
    }

    logWithTimestamp('');

    // Test 3: Multiple potential endpoints
    logWithTimestamp('🔍 TEST 3: Testing multiple potential endpoints');
    const testPaths = [
      '/health',
      '/status', 
      '/api',
      '/docs',
      '/swagger',
      '/insert',
      '/tables',
      '/company',
      '/company/marketing_company',
      '/schema',
      '/ping'
    ];
    
    for (const path of testPaths) {
      try {
        const startTime = performance.now();
        const testResponse = await fetch(`${endpoint}${path}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json, text/plain, */*'
          }
        });
        const endTime = performance.now();
        
        const responseText = await testResponse.text();
        
        logWithTimestamp(`🔗 ${path}:`);
        logWithTimestamp(`   Status: ${testResponse.status} ${testResponse.statusText}`);
        logWithTimestamp(`   Time: ${(endTime - startTime).toFixed(2)}ms`);
        logWithTimestamp(`   Content-Type: ${testResponse.headers.get('content-type')}`);
        logWithTimestamp(`   Response length: ${responseText.length}`);
        logWithTimestamp(`   Preview: ${responseText.substring(0, 150)}...`);
        
        if (testResponse.status >= 200 && testResponse.status < 300) {
          logWithTimestamp(`   ✅ Successful response`);
        } else if (testResponse.status >= 400 && testResponse.status < 500) {
          logWithTimestamp(`   ⚠️  Client error`);
        } else if (testResponse.status >= 500) {
          logWithTimestamp(`   🚨 Server error`);
        }
        
      } catch (error) {
        logWithTimestamp(`🔗 ${path}: ❌ ${error.message}`);
      }
      logWithTimestamp('');
    }

    // Test 4: Check CORS and preflight
    logWithTimestamp('🌐 TEST 4: CORS and preflight check');
    try {
      const corsResponse = await fetch(`${endpoint}/insert`, {
        method: 'OPTIONS'
      });
      
      logWithTimestamp(`🌐 OPTIONS request status: ${corsResponse.status}`);
      logWithTimestamp(`🌐 Access-Control-Allow-Origin: ${corsResponse.headers.get('access-control-allow-origin')}`);
      logWithTimestamp(`🌐 Access-Control-Allow-Methods: ${corsResponse.headers.get('access-control-allow-methods')}`);
      logWithTimestamp(`🌐 Access-Control-Allow-Headers: ${corsResponse.headers.get('access-control-allow-headers')}`);
      
    } catch (error) {
      logError('CORS preflight test', error);
    }

    logWithTimestamp('');
    logWithTimestamp('🏁 Testing completed!');
    logWithTimestamp('');
    logWithTimestamp('💡 Troubleshooting tips:');
    logWithTimestamp('   - If all requests show HTML responses, the API might not be running');
    logWithTimestamp('   - If you see CORS errors, the server needs CORS headers');
    logWithTimestamp('   - If 404 errors, check if /insert endpoint exists');
    logWithTimestamp('   - If 500 errors, there might be a server-side issue');
    logWithTimestamp('   - Check network tab in browser dev tools for more details');

    setIsLoading(false);
  };

  return (
    <Card className="p-6 mt-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">API Endpoint Tester & Debugger</h3>
          <Badge variant="outline">Detailed Logging</Badge>
        </div>
        
        <Button 
          onClick={testEndpoints} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Running Comprehensive Tests...' : 'Test API Endpoints (Detailed)'}
        </Button>
        
        {response && (
          <div>
            <h4 className="font-medium mb-2">Detailed Test Results & Debug Log:</h4>
            <Textarea 
              value={response}
              readOnly
              className="min-h-[500px] font-mono text-xs"
              placeholder="Test results will appear here..."
            />
          </div>
        )}
      </div>
    </Card>
  );
};