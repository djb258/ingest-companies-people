// CORS Template Package - Main Export
export { default as CorsStatus } from './components/CorsStatus';
export { default as ApiConnectionStatus } from './components/ApiConnectionStatus';
export { default as EnhancedApiTester } from './components/EnhancedApiTester';
export { createApiClient } from './utils/apiClient';
export { 
  checkCorsHealth, 
  quickCorsTest, 
  testCorsWithCredentials 
} from './utils/corsDebugger';
export type { 
  CorsTestResult, 
  ApiClientConfig,
  CorsStatusProps,
  ApiConnectionStatusProps 
} from './types';