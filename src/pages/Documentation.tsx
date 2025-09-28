import React from 'react';
import { FileText, Book, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Documentation = () => {
  const dataIngestionDocs = [
    { title: 'Quick Start Guide', description: 'Get up and running with data ingestion in minutes' },
    { title: 'File Format Support', description: 'Supported CSV and Excel formats and requirements' },
    { title: 'API Integration', description: 'Connecting to Render API endpoints' },
    { title: 'Troubleshooting', description: 'Common issues and solutions' },
  ];

  const imoCreatorDocs = [
    { title: 'IMO Creator Overview', description: 'Understanding the blueprint planning system' },
    { title: 'SSOT Manifests', description: 'Single Source of Truth configuration' },
    { title: 'HEIR Compliance', description: 'Hierarchical Error-handling and ID management' },
    { title: 'MCP Integration', description: 'Model Context Protocol server setup' },
  ];

  const apiDocs = [
    { title: 'REST API Reference', description: 'Complete API documentation' },
    { title: 'Authentication', description: 'API key management and security' },
    { title: 'Rate Limits', description: 'API usage limits and best practices' },
    { title: 'Error Codes', description: 'HTTP status codes and error handling' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Documentation</h1>
        <p className="text-muted-foreground">Comprehensive guides and API references for the integrated platform</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">README</CardTitle>
            </div>
            <CardDescription>Main repository documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              View README
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Book className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">IMO Architecture</CardTitle>
            </div>
            <CardDescription>System architecture documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Architecture
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Sample Files</CardTitle>
            </div>
            <CardDescription>Example configuration files</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Samples
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Documentation Sections */}
      <Tabs defaultValue="data-ingestion" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="data-ingestion">Data Ingestion</TabsTrigger>
          <TabsTrigger value="imo-creator">IMO Creator</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
        </TabsList>

        <TabsContent value="data-ingestion" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataIngestionDocs.map((doc, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{doc.title}</CardTitle>
                  <CardDescription>{doc.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Read Documentation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Operation Guide</CardTitle>
              <CardDescription>Step-by-step guide for data ingestion operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <h4>What This Application Does</h4>
                <p>This application provides a complete data ingestion pipeline for marketing data:</p>
                <ol>
                  <li><strong>File Upload</strong>: Upload CSV or Excel files containing company/people data</li>
                  <li><strong>Data Preview</strong>: View parsed data in a table format before submission</li>
                  <li><strong>Data Ingestion</strong>: Send data to Neon database via Render API</li>
                  <li><strong>API Testing</strong>: Debug and test API endpoints with detailed logging</li>
                </ol>

                <h4>Expected Data Formats</h4>
                <h5>Company Data</h5>
                <pre className="bg-muted p-2 rounded text-xs">
{`company_name,domain,industry,employee_count,location
"Tech Corp","techcorp.com","Technology",150,"San Francisco"
"Marketing Inc","marketing.com","Marketing",50,"New York"`}
                </pre>

                <h5>People Data</h5>
                <pre className="bg-muted p-2 rounded text-xs">
{`first_name,last_name,email,company,title
"John","Doe","john@techcorp.com","Tech Corp","Engineer"
"Jane","Smith","jane@marketing.com","Marketing Inc","Manager"`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="imo-creator" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {imoCreatorDocs.map((doc, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{doc.title}</CardTitle>
                  <CardDescription>{doc.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Read Documentation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>IMO Creator Features</CardTitle>
              <CardDescription>Overview of blueprint planning and management capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <h4>Key Features</h4>
                <ul>
                  <li><strong>4-Page UI</strong>: Overview with progress visual, Input/Middle/Output pages</li>
                  <li><strong>SSOT Manifest</strong>: YAML-based configuration with flexible stages per bucket</li>
                  <li><strong>Scoring</strong>: Automatic progress calculation (done/wip/todo)</li>
                  <li><strong>Visuals</strong>: Mermaid diagrams for overview and per-bucket ladders</li>
                  <li><strong>API</strong>: Optional FastAPI for manifest GET/PUT operations</li>
                </ul>

                <h4>HEIR Integration</h4>
                <p>The system includes HEIR (Hierarchical Error-handling, ID management, and Reporting) integration:</p>
                <ul>
                  <li>Automatic ID stamping of unique_id, process_id, and blueprint_version_hash</li>
                  <li>Subagent Registry with garage-mcp integration and fallback</li>
                  <li>SSOT Processing for doctrine-safe ID stamping</li>
                  <li>MCP Server validation via /heir/check endpoint</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {apiDocs.map((doc, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{doc.title}</CardTitle>
                  <CardDescription>{doc.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Read Documentation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>Available API endpoints and their usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <h4>Data Ingestion API</h4>
                <ul>
                  <li><code>POST /insert</code> - Insert data records into database</li>
                  <li><code>GET /health</code> - Health check endpoint</li>
                </ul>

                <h4>IMO Creator API</h4>
                <ul>
                  <li><code>POST /api/ssot/save</code> - Save SSOT configuration</li>
                  <li><code>GET /api/subagents</code> - Get subagent registry</li>
                  <li><code>POST /heir/check</code> - HEIR compliance validation</li>
                  <li><code>POST /events</code> - Log telemetry events</li>
                </ul>

                <h4>Example Usage</h4>
                <pre className="bg-muted p-2 rounded text-xs">
{`# Insert data
curl -X POST https://render-marketing-db.onrender.com/insert \\
  -H "Content-Type: application/json" \\
  -d '{
    "records": [{"field1": "value1"}],
    "target_table": "company.marketing_company"
  }'

# HEIR check
curl -X POST http://localhost:7001/heir/check \\
  -H "Content-Type: application/json" \\
  -d '{
    "ssot": {
      "meta": {"app_name": "imo-creator"},
      "doctrine": {"schema_version": "HEIR/1.0"}
    }
  }'`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;