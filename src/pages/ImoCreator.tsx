import React, { useState } from 'react';
import { Blueprint, FileText, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const ImoCreator = () => {
  const [currentStage, setCurrentStage] = useState('overview');

  const stages = [
    { id: 'overview', name: 'Overview', icon: Blueprint, status: 'completed' },
    { id: 'input', name: 'Input', icon: FileText, status: 'in-progress' },
    { id: 'middle', name: 'Middle', icon: Settings, status: 'pending' },
    { id: 'output', name: 'Output', icon: CheckCircle, status: 'pending' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="default" className="bg-yellow-500">In Progress</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">IMO Creator</h1>
        <p className="text-muted-foreground">Blueprint planning and SSOT manifest management system</p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Blueprint className="h-5 w-5" />
            <span>Blueprint Progress</span>
          </CardTitle>
          <CardDescription>Track your progress through the IMO creation process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(stage.status)}
                  <stage.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-foreground">{stage.name}</h3>
                    {getStatusBadge(stage.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">Stage {index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={currentStage} onValueChange={setCurrentStage} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {stages.map((stage) => (
            <TabsTrigger key={stage.id} value={stage.id} className="flex items-center space-x-2">
              <stage.icon className="h-4 w-4" />
              <span>{stage.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>High-level view of your IMO project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Project Details</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• App Name: IMO Creator Integration</p>
                      <p>• Stage: Overview</p>
                      <p>• Version: 1.0.0</p>
                      <p>• Status: Active</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">HEIR Compliance</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Unique ID: Generated</p>
                      <p>• Process ID: Active</p>
                      <p>• Schema Version: HEIR/1.0</p>
                      <p>• Validation: Passed</p>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Features Available</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <p>• SSOT Manifest Management</p>
                    <p>• Automatic ID Generation</p>
                    <p>• Visual Progress Tracking</p>
                    <p>• MCP Server Integration</p>
                    <p>• HEIR Compliance Validation</p>
                    <p>• Subagent Registry</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Input Configuration</CardTitle>
              <CardDescription>Configure input parameters and data sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  This section allows you to configure input parameters for your blueprint.
                  Set up data sources, input validation rules, and initial configuration.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Input configuration features will be available in the next update.
                    This includes form builders, validation schema, and data source connections.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="middle" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Processing Logic</CardTitle>
              <CardDescription>Define processing rules and business logic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Configure the processing logic that transforms input data into desired outputs.
                  Set up workflows, validation rules, and transformation steps.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Processing logic configuration features will be available in the next update.
                    This includes workflow builders, rule engines, and transformation pipelines.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="output" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Output Configuration</CardTitle>
              <CardDescription>Configure output formats and destinations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Set up output configurations including format specifications, destination systems,
                  and delivery methods for your processed data.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Output configuration features will be available in the next update.
                    This includes format builders, destination connectors, and delivery scheduling.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline">
          Export Configuration
        </Button>
        <div className="space-x-2">
          <Button variant="outline">
            Save Progress
          </Button>
          <Button>
            Continue to Next Stage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImoCreator;