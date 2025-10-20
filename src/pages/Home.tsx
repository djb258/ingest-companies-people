import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Layers, ArrowRight, FileText, Cpu, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Home = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Welcome to the Integrated Platform</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A unified platform combining data ingestion capabilities with IMO Creator blueprint management system.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-primary" />
              <CardTitle>Data Ingestion</CardTitle>
            </div>
            <CardDescription>
              Upload and process CSV/Excel files containing company and people data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground mb-4">
              <li>• CSV/Excel file upload with drag & drop</li>
              <li>• Data preview and validation</li>
              <li>• Direct integration with Neon database</li>
              <li>• Comprehensive API testing tools</li>
            </ul>
            <Button asChild className="w-full">
              <Link to="/data-ingestion">
                Start Data Ingestion <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Layers className="h-6 w-6 text-primary" />
              <CardTitle>IMO Creator</CardTitle>
            </div>
            <CardDescription>
              Blueprint planning and SSOT manifest management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground mb-4">
              <li>• 4-page blueprint planning UI</li>
              <li>• YAML-based SSOT manifests</li>
              <li>• Visual progress tracking</li>
              <li>• HEIR compliance validation</li>
            </ul>
            <Button asChild className="w-full">
              <Link to="/imo-creator">
                Open IMO Creator <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <CardTitle>Documentation</CardTitle>
            </div>
            <CardDescription>
              Comprehensive documentation and API references
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground mb-4">
              <li>• Setup and configuration guides</li>
              <li>• API documentation</li>
              <li>• Architecture overview</li>
              <li>• Troubleshooting guides</li>
            </ul>
            <Button asChild className="w-full" variant="outline">
              <Link to="/docs">
                View Documentation <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg border p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Cpu className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">MCP Integration</h3>
          <p className="text-muted-foreground">Model Context Protocol servers for enhanced functionality</p>
        </div>

        <div className="bg-card rounded-lg border p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Settings className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">HEIR Compliance</h3>
          <p className="text-muted-foreground">Hierarchical Error-handling and ID management</p>
        </div>

        <div className="bg-card rounded-lg border p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Database className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">Unified Platform</h3>
          <p className="text-muted-foreground">Single platform for data management and blueprints</p>
        </div>
      </div>
    </div>
  );
};

export default Home;