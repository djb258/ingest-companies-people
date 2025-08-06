// Configurable API Connection Status Component
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { quickCorsTest, testCorsWithCredentials } from '../utils/corsDebugger';
import { createApiClient } from '../utils/apiClient';
import type { ApiConnectionStatusProps, CorsTestResult } from '../types';
import { cn } from '@/lib/utils';

type ConnectionStatus = 'checking' | 'connected' | 'error';

export default function ApiConnectionStatus({ 
  apiUrl, 
  className = '',
  autoCheck = true,
  showAdvancedTests = true 
}: ApiConnectionStatusProps) {
  const [status, setStatus] = useState<ConnectionStatus>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [corsTestResult, setCorsTestResult] = useState<CorsTestResult | null>(null);

  const checkConnection = async () => {
    setIsLoading(true);
    setStatus('checking');
    setError(null);
    
    try {
      const apiClient = createApiClient({ 
        baseURL: apiUrl,
        enableLogging: false 
      });
      
      const response = await apiClient.get('/api/health');
      setStatus('connected');
      setLastCheck(new Date());
    } catch (err: any) {
      setStatus('error');
      setError(formatError(err));
      setLastCheck(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  const runCorsTest = async () => {
    setIsLoading(true);
    try {
      const result = await quickCorsTest(apiUrl);
      setCorsTestResult(result);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoCheck) {
      checkConnection();
    }
  }, [apiUrl, autoCheck]);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Clock className="h-4 w-4 animate-pulse" />;
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'checking':
        return <Badge variant="secondary">Checking...</Badge>;
      case 'connected':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  const formatError = (err: any) => {
    const enhanced = err?.enhancedError;
    if (enhanced?.isCorsError) {
      return `CORS Error: ${enhanced.message}. Check server CORS configuration.`;
    }
    if (enhanced?.status) {
      return `HTTP ${enhanced.status}: ${enhanced.statusText || 'Request failed'}`;
    }
    return err?.message || 'Unknown connection error';
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getStatusIcon()}
            API Connection Status
          </CardTitle>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-muted-foreground">
          Endpoint: {apiUrl}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={checkConnection}
            disabled={isLoading}
            size="sm"
            variant="outline"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Test Connection
          </Button>

          {showAdvancedTests && (
            <Button
              onClick={runCorsTest}
              disabled={isLoading}
              size="sm"
              variant="outline"
            >
              CORS Test
            </Button>
          )}
        </div>

        {lastCheck && (
          <p className="text-xs text-muted-foreground">
            Last checked: {lastCheck.toLocaleTimeString()}
          </p>
        )}

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription className="whitespace-pre-wrap">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {corsTestResult && (
          <Alert variant={corsTestResult.success ? "default" : "destructive"}>
            <AlertDescription>
              <strong>CORS Test:</strong> {corsTestResult.message}
              {corsTestResult.details && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm">View Details</summary>
                  <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-auto">
                    {JSON.stringify(corsTestResult.details, null, 2)}
                  </pre>
                </details>
              )}
            </AlertDescription>
          </Alert>
        )}

        {showAdvancedTests && (
          <div className="pt-2 border-t">
            <Button
              onClick={() => {
                setStatus('checking');
                setError(null);
                setCorsTestResult(null);
                setLastCheck(null);
              }}
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              Clear Status
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}