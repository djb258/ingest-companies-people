import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { checkHealth } from '@/services/services.js';

const ApiConnectionStatus = () => {
  const [status, setStatus] = useState('idle'); // idle, checking, connected, error
  const [lastCheck, setLastCheck] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkConnection = async () => {
    setIsLoading(true);
    setStatus('checking');
    setError(null);

    try {
      const result = await checkHealth();
      
      if (result.success) {
        setStatus('connected');
        setLastCheck(new Date());
      } else {
        setStatus('error');
        setError(result.error);
      }
    } catch (err) {
      setStatus('error');
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-check on component mount
    checkConnection();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'checking':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-500">Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">Connection Error</Badge>;
      case 'checking':
        return <Badge variant="secondary">Checking...</Badge>;
      default:
        return <Badge variant="outline">Not Checked</Badge>;
    }
  };

  const formatError = (error) => {
    if (!error) return '';
    
    if (error.isCorsError) {
      return `CORS Error: ${error.message}. The API server needs to allow requests from ${window.location.origin}`;
    }
    
    if (error.status === 404) {
      return 'API endpoint not found. Check if the server is running and the URL is correct.';
    }
    
    if (error.status >= 500) {
      return `Server Error (${error.status}): ${error.message}`;
    }
    
    return error.message || 'Unknown connection error';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">API Connection</CardTitle>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Endpoint: render-marketing-db.onrender.com
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={checkConnection}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                'Test Connection'
              )}
            </Button>
          </div>
          
          {lastCheck && (
            <div className="text-xs text-muted-foreground">
              Last checked: {lastCheck.toLocaleTimeString()}
            </div>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {formatError(error)}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiConnectionStatus;