// Configurable CORS Debugging Utilities
import type { CorsTestResult } from '../types';

export async function checkCorsHealth(apiBaseUrl: string): Promise<string | null> {
  try {
    const res = await fetch(`${apiBaseUrl}/api/health`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) throw new Error(`Status: ${res.status}`);
    return null; // All good!
  } catch (err) {
    return `❌ CORS or Network error. Check if the server at ${apiBaseUrl} allows requests from this origin:
- Your Origin: ${window.location.origin}
- Error: ${err instanceof Error ? err.message : 'Unknown error'}

✅ Solution: Add your Lovable.dev origin to the CORS whitelist on the Render API server.`;
  }
}

export async function quickCorsTest(apiBaseUrl: string): Promise<CorsTestResult> {
  try {
    // Test simple GET request first
    const response = await fetch(`${apiBaseUrl}/api/health`, {
      method: 'GET',
      mode: 'cors',
    });

    if (response.ok) {
      return {
        success: true,
        message: 'CORS configuration is working correctly',
        details: {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
        },
      };
    } else {
      return {
        success: false,
        message: `Server responded with status ${response.status}`,
        details: { status: response.status },
      };
    }
  } catch (error) {
    const corsError = error instanceof Error && error.message.includes('CORS');
    return {
      success: false,
      message: corsError 
        ? 'CORS policy is blocking the request'
        : `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { error: error instanceof Error ? error.message : 'Unknown error' },
    };
  }
}

export async function testCorsWithCredentials(apiBaseUrl: string): Promise<CorsTestResult> {
  try {
    const response = await fetch(`${apiBaseUrl}/api/health`, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors',
    });

    return {
      success: response.ok,
      message: response.ok 
        ? 'CORS with credentials is working'
        : `CORS with credentials failed: ${response.status}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `CORS with credentials blocked: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}