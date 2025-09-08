import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import { postMarketingCompanies } from '@/services/services';
import { mcpDirectInsert, checkMCPHealth } from '@/services/mcp-api';
import { useToast } from '@/hooks/use-toast';

interface IngestionFormProps {
  records: Record<string, any>[];
  tableType: 'companies' | 'people';
}

export const IngestionForm: React.FC<IngestionFormProps> = ({ records, tableType }) => {
  const [endpoint, setEndpoint] = useState('https://render-marketing-db.onrender.com');
  const [targetTable, setTargetTable] = useState(
    tableType === 'companies' ? 'marketing db.intake.company_raw_intake' : ''
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any | null>(null);
  const [useMCP, setUseMCP] = useState(true); // Use MCP by default to avoid CORS
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (records.length === 0) {
      toast({
        variant: "destructive",
        title: "No Data",
        description: "Please upload a file first",
      });
      return;
    }

    if (!endpoint.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Endpoint",
        description: "Please enter your Render API endpoint",
      });
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      let result;
      
      if (useMCP) {
        // Use MCP direct insertion to bypass CORS
        console.log('🔌 Using MCP Direct Insert (no CORS issues)');
        result = await mcpDirectInsert(records, targetTable.trim() || 'marketing db.intake.company_raw_intake');
      } else {
        // Use traditional API call
        console.log('📡 Using Traditional API Call');
        result = await postMarketingCompanies(records, targetTable.trim() || 'marketing db.intake.company_raw_intake');
      }
      setUploadResult(result);
      
      if (result.success) {
        toast({
          title: "Upload Successful",
          description: `Inserted ${result.inserted} records, ${result.failed} failed`,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Upload error in component:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Send to API</h2>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="capitalize">
              {tableType}
            </Badge>
            <Badge variant={records.length > 0 ? "default" : "secondary"}>
              {records.length} records ready
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="endpoint">Render API Endpoint</Label>
            <Input
              id="endpoint"
              type="url"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="https://your-render-api.onrender.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-table">Target Table (optional)</Label>
            <Input
              id="target-table"
              value={targetTable}
              onChange={(e) => setTargetTable(e.target.value)}
              placeholder="Leave blank to use default table"
            />
          </div>

          <div className="space-y-2">
            <Label>Connection Method</Label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={useMCP}
                  onChange={() => setUseMCP(true)}
                  className="text-primary"
                />
                <span className="text-sm">MCP Direct (No CORS issues)</span>
                <Badge variant="default" className="text-xs">Recommended</Badge>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={!useMCP}
                  onChange={() => setUseMCP(false)}
                  className="text-primary"
                />
                <span className="text-sm">Traditional API</span>
              </label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={records.length === 0 || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Data to API
              </>
            )}
          </Button>
        </form>

        {uploadResult && (
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Upload Results</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 p-3 bg-success/10 border border-success/20 rounded-lg">
                <CheckCircle className="h-4 w-4 text-success" />
                <div>
                  <p className="text-sm font-medium text-foreground">Inserted</p>
                  <p className="text-lg font-bold text-success">{uploadResult.inserted}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <div>
                  <p className="text-sm font-medium text-foreground">Failed</p>
                  <p className="text-lg font-bold text-destructive">{uploadResult.failed}</p>
                </div>
              </div>
            </div>

            {uploadResult.schema_hash && (
              <div className="text-xs text-muted-foreground">
                Schema Hash: {uploadResult.schema_hash}
              </div>
            )}

            {uploadResult.errors && uploadResult.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-destructive">Errors:</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  {uploadResult.errors.slice(0, 5).map((error, index) => (
                    <div key={index} className="p-2 bg-destructive/5 rounded">
                      {error}
                    </div>
                  ))}
                  {uploadResult.errors.length > 5 && (
                    <p>... and {uploadResult.errors.length - 5} more errors</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};