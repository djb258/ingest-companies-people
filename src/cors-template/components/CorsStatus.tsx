// Configurable CORS Status Component
import { useEffect, useState } from 'react';
import { checkCorsHealth } from '../utils/corsDebugger';
import type { CorsStatusProps } from '../types';
import { cn } from '@/lib/utils';

export default function CorsStatus({ 
  apiUrl, 
  className = '',
  successMessage = '✅ CORS OK',
  showDetails = false 
}: CorsStatusProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    checkCorsHealth(apiUrl)
      .then(setError)
      .finally(() => setIsLoading(false));
  }, [apiUrl]);

  if (isLoading) {
    return (
      <div className={cn("text-muted-foreground animate-pulse", className)}>
        🔄 Checking CORS...
      </div>
    );
  }

  if (!error) {
    return (
      <div className={cn("text-green-600 dark:text-green-400", className)}>
        {successMessage}
        {showDetails && (
          <div className="text-xs text-muted-foreground mt-1">
            Connected to {apiUrl}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "text-red-600 dark:text-red-400 whitespace-pre-wrap",
      "bg-red-50 dark:bg-red-950/20 p-2 rounded border border-red-200 dark:border-red-800",
      className
    )}>
      {error}
    </div>
  );
}