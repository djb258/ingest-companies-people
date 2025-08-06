// Type definitions for CORS Template Package

export interface CorsTestResult {
  success: boolean;
  message: string;
  details?: any;
}

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  withCredentials?: boolean;
  enableLogging?: boolean;
}

export interface CorsStatusProps {
  apiUrl: string;
  className?: string;
  successMessage?: string;
  showDetails?: boolean;
}

export interface ApiConnectionStatusProps {
  apiUrl: string;
  className?: string;
  autoCheck?: boolean;
  showAdvancedTests?: boolean;
}

export interface EnhancedApiTesterProps {
  apiUrl: string;
  className?: string;
  endpoints?: string[];
  showLogs?: boolean;
}