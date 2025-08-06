// Configurable Enhanced API Tester Component
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { createApiClient } from '../utils/apiClient';
import { quickCorsTest, testCorsWithCredentials } from '../utils/corsDebugger';
import type { EnhancedApiTesterProps } from '../types';
import { cn } from '@/lib/utils';

interface LogEntry {
  timestamp: string;
  message: string;
  type?: 'info' | 'success' | 'error';
}

export default function EnhancedApiTester({ 
  apiUrl, 
  className = '',
  endpoints = ['health', 'companies', 'apollo'],
  showLogs = true 
}: EnhancedApiTesterProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string, type?: 'info' | 'success' | 'error') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const clearLogs = () => setLogs([]);

  const testEndpoint = async (name: string, testFunction: () => Promise<any>) => {
    addLog(`🧪 Testing ${name}...`, 'info');
    try {
      const result = await testFunction();
      if (result?.success !== false) {
        addLog(`✅ ${name} test passed`, 'success');
        if (result?.data) {
          addLog(`📊 Data: ${JSON.stringify(result.data, null, 2)}`);
        }
      } else {
        addLog(`❌ ${name} test failed: ${result.message || 'Unknown error'}`, 'error');
      }
    } catch (error: any) {
      addLog(`💥 ${name} test threw exception: ${error.message}`, 'error');
      if (error.enhancedError) {
        addLog(`🔍 Enhanced error details: ${JSON.stringify(error.enhancedError, null, 2)}`);
      }
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);
    clearLogs();
    addLog('🚀 Starting comprehensive API tests...', 'info');
    
    const apiClient = createApiClient({ 
      baseURL: apiUrl, 
      enableLogging: true 
    });

    // Health check
    await testEndpoint('Health Check', async () => {
      const response = await apiClient.get('/api/health');
      return { success: true, data: response.data };
    });

    // Test configured endpoints
    for (const endpoint of endpoints) {
      if (endpoint === 'health') continue; // Already tested
      
      await testEndpoint(`GET /${endpoint}`, async () => {
        const response = await apiClient.get(`/api/${endpoint}`);
        return { success: true, data: response.data };
      });
    }

    // CORS tests
    await testEndpoint('CORS Basic', () => quickCorsTest(apiUrl));
    await testEndpoint('CORS with Credentials', () => testCorsWithCredentials(apiUrl));

    addLog('🏁 All tests completed!', 'info');
    setIsLoading(false);
  };

  const testSingleEndpoint = async (endpointName: string) => {
    if (!endpointName.trim()) return;
    
    setIsLoading(true);
    const apiClient = createApiClient({ 
      baseURL: apiUrl, 
      enableLogging: true 
    });

    await testEndpoint(`Single Test: ${endpointName}`, async () => {
      const url = endpointName.startsWith('/') ? endpointName : `/api/${endpointName}`;
      const response = await apiClient.get(url);
      return { success: true, data: response.data };
    });
    
    setIsLoading(false);
  };

  const runCorsDebug = async (testType: string) => {
    setIsLoading(true);
    addLog(`🔍 Running ${testType}...`, 'info');

    switch (testType) {
      case 'quick':
        await testEndpoint('Quick CORS Check', () => quickCorsTest(apiUrl));
        break;
      case 'credentials':
        await testEndpoint('CORS with Credentials', () => testCorsWithCredentials(apiUrl));
        break;
      case 'full':
        addLog('🔍 Running full CORS diagnostics...', 'info');
        await testEndpoint('CORS Preflight', () => quickCorsTest(apiUrl));
        await testEndpoint('CORS with Credentials', () => testCorsWithCredentials(apiUrl));
        addLog(`🌐 Origin: ${window.location.origin}`, 'info');
        addLog(`🎯 Target: ${apiUrl}`, 'info');
        break;
    }

    setIsLoading(false);
  };

  const getLogColor = (type?: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-foreground';
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Enhanced API Tester</CardTitle>
          <Badge variant="outline">{apiUrl}</Badge>
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
            <div className="flex gap-2">
              <Button 
                onClick={runAllTests} 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Running Tests...' : 'Run All API Tests'}
              </Button>
              <Button 
                onClick={clearLogs} 
                variant="outline"
                disabled={isLoading}
              >
                Clear Logs
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="individual" className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {endpoints.map(endpoint => (
                <Button
                  key={endpoint}
                  onClick={() => testSingleEndpoint(endpoint)}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                >
                  Test {endpoint}
                </Button>
              ))}
            </div>
            <Button 
              onClick={clearLogs} 
              variant="outline" 
              size="sm"
              disabled={isLoading}
            >
              Clear Logs
            </Button>
          </TabsContent>

          <TabsContent value="cors" className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <Button
                onClick={() => runCorsDebug('quick')}
                disabled={isLoading}
                variant="outline"
              >
                Quick CORS Check
              </Button>
              <Button
                onClick={() => runCorsDebug('credentials')}
                disabled={isLoading}
                variant="outline"
              >
                Test CORS with Credentials
              </Button>
              <Button
                onClick={() => runCorsDebug('full')}
                disabled={isLoading}
                variant="outline"
              >
                Full CORS Diagnostics
              </Button>
            </div>
            <Button 
              onClick={clearLogs} 
              variant="outline" 
              size="sm"
              disabled={isLoading}
            >
              Clear Logs
            </Button>
          </TabsContent>
        </Tabs>

        {showLogs && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Test Logs</h4>
              <Badge variant="secondary">{logs.length} entries</Badge>
            </div>
            <ScrollArea className="h-64 w-full border rounded-md">
              <Textarea
                value={logs.map(log => `[${log.timestamp}] ${log.message}`).join('\n')}
                readOnly
                placeholder="Test logs will appear here..."
                className="min-h-[240px] border-0 resize-none focus-visible:ring-0"
              />
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}