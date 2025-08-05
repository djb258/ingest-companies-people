import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { uploadToRender } from '@/utils/uploadToRender';

export const ApiTester: React.FC = () => {
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testEndpoints = async () => {
    setIsLoading(true);
    setResponse('Testing API endpoints...\n\n');
    
    const endpoint = 'https://render-marketing-db.onrender.com';
    
    // Test basic connectivity
    try {
      const basicResponse = await fetch(endpoint);
      setResponse(prev => prev + `✓ Basic connectivity: ${basicResponse.status}\n`);
    } catch (error) {
      setResponse(prev => prev + `✗ Basic connectivity failed: ${error}\n`);
    }

    // Test insert endpoint with sample data
    try {
      const testData = {
        records: [
          {
            company_name: 'Test Company',
            domain: 'test.com',
            industry: 'Technology',
            employee_count: 100
          }
        ],
        target_table: 'company.marketing_company'
      };

      const result = await uploadToRender(endpoint, testData);
      setResponse(prev => prev + `✓ Insert test successful: ${JSON.stringify(result, null, 2)}\n`);
    } catch (error) {
      setResponse(prev => prev + `✗ Insert test failed: ${error}\n`);
    }

    // Test other potential endpoints
    const testEndpoints = ['/health', '/status', '/tables', '/company/marketing_company'];
    
    for (const path of testEndpoints) {
      try {
        const response = await fetch(`${endpoint}${path}`);
        const text = await response.text();
        setResponse(prev => prev + `${path}: ${response.status} - ${text.substring(0, 100)}...\n`);
      } catch (error) {
        setResponse(prev => prev + `${path}: Error - ${error}\n`);
      }
    }

    setIsLoading(false);
  };

  return (
    <Card className="p-6 mt-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">API Endpoint Tester</h3>
          <Badge variant="outline">Testing Mode</Badge>
        </div>
        
        <Button 
          onClick={testEndpoints} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Testing...' : 'Test API Endpoints'}
        </Button>
        
        {response && (
          <div>
            <h4 className="font-medium mb-2">Test Results:</h4>
            <Textarea 
              value={response}
              readOnly
              className="min-h-[300px] font-mono text-xs"
            />
          </div>
        )}
      </div>
    </Card>
  );
};