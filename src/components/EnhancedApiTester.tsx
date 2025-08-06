import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  checkHealth,
  getCompanies,
  postCompany,
  getApolloData,
  postApolloData,
  uploadRecords
} from '@/services/services';
import { checkCorsHealth, quickCorsTest, testCorsWithCredentials } from '@/utils/corsDebugger';

const EnhancedApiTester = () => {
  const [logs, setLogs] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    setLogs(prev => `${prev}[${timestamp}] ${prefix} ${message}\n`);
  };

  const clearLogs = () => setLogs('');

  const testEndpoint = async (name, testFunction, ...args) => {
    addLog(`Testing ${name}...`);
    try {
      const result = await testFunction(...args);
      if (result.success) {
        addLog(`${name} - SUCCESS: ${result.message || 'Request completed'}`, 'success');
        if (result.data) {
          addLog(`${name} - Data: ${JSON.stringify(result.data, null, 2)}`);
        }
      } else {
        addLog(`${name} - FAILED: ${result.message || 'Request failed'}`, 'error');
        if (result.error) {
          addLog(`${name} - Error Details: ${JSON.stringify(result.error, null, 2)}`, 'error');
        }
      }
    } catch (error) {
      addLog(`${name} - EXCEPTION: ${error.message}`, 'error');
      addLog(`${name} - Full Error: ${JSON.stringify(error, null, 2)}`, 'error');
    }
    addLog('---');
  };

  const runAllTests = async () => {
    setIsLoading(true);
    clearLogs();
    addLog('🚀 Starting comprehensive API tests...');
    addLog('');

    // Test 1: Health Check
    await testEndpoint('Health Check', checkHealth);

    // Test 2: Get Companies
    await testEndpoint('Get Companies', getCompanies);

    // Test 3: Post Company
    const sampleCompany = {
      name: 'Test Company',
      email: 'test@company.com',
      industry: 'Technology'
    };
    await testEndpoint('Post Company', postCompany, sampleCompany);

    // Test 4: Get Apollo Data
    await testEndpoint('Get Apollo Data', getApolloData);

    // Test 5: Post Apollo Data
    const sampleApollo = {
      contact_id: 'test_123',
      name: 'Test Contact',
      email: 'test@apollo.com'
    };
    await testEndpoint('Post Apollo Data', postApolloData, sampleApollo);

    // Test 6: Legacy Upload
    const sampleRecords = [
      { name: 'Legacy Test', email: 'legacy@test.com' }
    ];
    await testEndpoint('Legacy Upload', uploadRecords, sampleRecords, 'companies');

    addLog('🏁 All tests completed!', 'success');
    setIsLoading(false);
  };

  const testSingleEndpoint = async (endpointName) => {
    setIsLoading(true);
    addLog(`🎯 Testing single endpoint: ${endpointName}`);
    addLog('');

    switch (endpointName) {
      case 'health':
        await testEndpoint('Health Check', checkHealth);
        break;
      case 'companies-get':
        await testEndpoint('Get Companies', getCompanies);
        break;
      case 'companies-post':
        await testEndpoint('Post Company', postCompany, {
          name: 'Single Test Company',
          email: 'single@test.com'
        });
        break;
      case 'apollo-get':
        await testEndpoint('Get Apollo Data', getApolloData);
        break;
      case 'apollo-post':
        await testEndpoint('Post Apollo Data', postApolloData, {
          contact_id: 'single_test',
          name: 'Single Test Contact'
        });
        break;
    }

    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Enhanced API Tester</CardTitle>
          <Badge variant="outline">CORS Debugging</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Run All Tests</TabsTrigger>
            <TabsTrigger value="individual">Individual Tests</TabsTrigger>
            <TabsTrigger value="cors">CORS Debug</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <Button 
              onClick={runAllTests} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Testing All Endpoints...' : 'Test All API Endpoints'}
            </Button>
          </TabsContent>
          
          <TabsContent value="individual" className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => testSingleEndpoint('health')}
                disabled={isLoading}
              >
                Health Check
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => testSingleEndpoint('companies-get')}
                disabled={isLoading}
              >
                Get Companies
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => testSingleEndpoint('companies-post')}
                disabled={isLoading}
              >
                Post Company
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => testSingleEndpoint('apollo-get')}
                disabled={isLoading}
              >
                Get Apollo
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => testSingleEndpoint('apollo-post')}
                disabled={isLoading}
              >
                Post Apollo
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="cors" className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Button 
                variant="outline" 
                onClick={async () => {
                  setIsLoading(true);
                  clearLogs();
                  addLog('🔍 Running Quick CORS Test...');
                  
                  const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://render-marketing-db.onrender.com';
                  const result = await quickCorsTest(apiBaseUrl);
                  
                  if (result.success) {
                    addLog('✅ CORS Test PASSED', 'success');
                    addLog(`Message: ${result.message}`);
                  } else {
                    addLog('❌ CORS Test FAILED', 'error');
                    addLog(`Message: ${result.message}`, 'error');
                  }
                  
                  if (result.details) {
                    addLog(`Details: ${JSON.stringify(result.details, null, 2)}`);
                  }
                  
                  setIsLoading(false);
                }}
                disabled={isLoading}
              >
                Quick CORS Check
              </Button>
              
              <Button 
                variant="outline" 
                onClick={async () => {
                  setIsLoading(true);
                  clearLogs();
                  addLog('🔐 Testing CORS with Credentials...');
                  
                  const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://render-marketing-db.onrender.com';
                  const result = await testCorsWithCredentials(apiBaseUrl);
                  
                  if (result.success) {
                    addLog('✅ CORS with Credentials PASSED', 'success');
                  } else {
                    addLog('❌ CORS with Credentials FAILED', 'error');
                  }
                  addLog(`Message: ${result.message}`);
                  
                  setIsLoading(false);
                }}
                disabled={isLoading}
              >
                Test CORS with Credentials
              </Button>

              <Button 
                variant="outline" 
                onClick={async () => {
                  setIsLoading(true);
                  clearLogs();
                  addLog('🌐 Running Comprehensive CORS Diagnostics...');
                  
                  const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://render-marketing-db.onrender.com';
                  
                  // Test basic CORS
                  const basicResult = await quickCorsTest(apiBaseUrl);
                  addLog(`Basic CORS: ${basicResult.success ? 'PASS' : 'FAIL'}`, basicResult.success ? 'success' : 'error');
                  
                  // Test with credentials
                  const credentialsResult = await testCorsWithCredentials(apiBaseUrl);
                  addLog(`CORS with Credentials: ${credentialsResult.success ? 'PASS' : 'FAIL'}`, credentialsResult.success ? 'success' : 'error');
                  
                  // Environment info
                  addLog('Environment Info:');
                  addLog(`- Origin: ${window.location.origin}`);
                  addLog(`- API Base URL: ${apiBaseUrl}`);
                  addLog(`- User Agent: ${navigator.userAgent.substring(0, 50)}...`);
                  
                  setIsLoading(false);
                }}
                disabled={isLoading}
              >
                Full CORS Diagnostics
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {logs && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Test Logs</h4>
              <Button variant="ghost" size="sm" onClick={clearLogs}>
                Clear Logs
              </Button>
            </div>
            <ScrollArea className="h-64">
              <Textarea
                value={logs}
                readOnly
                placeholder="Test logs will appear here..."
                className="min-h-64 font-mono text-xs resize-none"
              />
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedApiTester;