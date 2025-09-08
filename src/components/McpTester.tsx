import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Activity, CheckCircle, XCircle } from 'lucide-react';
import { checkMCPHealth, mcpDirectInsert, getMCPTableInfo } from '@/services/mcp-api';

export const McpTester: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState<'success' | 'error' | null>(null);

  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    setLogs(prev => [...prev, logEntry]);
  };

  const clearLogs = () => {
    setLogs([]);
    setHealthStatus(null);
  };

  const testMCPHealth = async () => {
    setIsLoading(true);
    addLog('Testing MCP Health Check...');
    
    try {
      const result = await checkMCPHealth();
      if (result.success) {
        addLog(`MCP Health: ${JSON.stringify(result.data)}`, 'success');
        setHealthStatus('success');
      } else {
        addLog(`MCP Health Failed: ${result.error}`, 'error');
        setHealthStatus('error');
      }
    } catch (error) {
      addLog(`MCP Health Exception: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      setHealthStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const testMCPTableInfo = async () => {
    setIsLoading(true);
    addLog('Testing MCP Table Info...');
    
    try {
      const result = await getMCPTableInfo();
      if (result.success) {
        addLog(`MCP Table Info: ${JSON.stringify(result.tableInfo, null, 2)}`, 'success');
      } else {
        addLog(`MCP Table Info Failed: ${result.error}`, 'error');
      }
    } catch (error) {
      addLog(`MCP Table Info Exception: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const testMCPInsert = async () => {
    setIsLoading(true);
    addLog('Testing MCP Insert with sample data...');
    
    const sampleData = [
      {
        company_name: 'Test Company MCP',
        domain: 'test-mcp.com',
        industry: 'Technology',
        employee_count: 100,
        created_at: new Date().toISOString()
      }
    ];
    
    try {
      const result = await mcpDirectInsert(sampleData, 'marketing.company_raw_intake');
      if (result.success) {
        addLog(`MCP Insert Success: Inserted ${result.inserted} records`, 'success');
        addLog(`Batch ID: ${result.batch_id}`, 'info');
      } else {
        addLog(`MCP Insert Failed: ${result.error}`, 'error');
        if (result.details) {
          addLog(`Details: ${JSON.stringify(result.details)}`, 'error');
        }
      }
    } catch (error) {
      addLog(`MCP Insert Exception: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <CardTitle>MCP API Tester</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {healthStatus === 'success' && (
              <Badge variant="default" className="bg-success/10 text-success border-success/20">
                <CheckCircle className="h-3 w-3 mr-1" />
                Healthy
              </Badge>
            )}
            {healthStatus === 'error' && (
              <Badge variant="destructive">
                <XCircle className="h-3 w-3 mr-1" />
                Error
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Button
            onClick={testMCPHealth}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            Health Check
          </Button>
          <Button
            onClick={testMCPTableInfo}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            Table Info
          </Button>
          <Button
            onClick={testMCPInsert}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            Test Insert
          </Button>
        </div>

        {logs.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Test Logs</h4>
              <Button onClick={clearLogs} variant="ghost" size="sm">
                Clear
              </Button>
            </div>
            <Textarea
              value={logs.join('\n')}
              readOnly
              className="font-mono text-xs h-48 resize-none"
              placeholder="Test logs will appear here..."
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};