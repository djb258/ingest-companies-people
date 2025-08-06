import React, { useState } from 'react';
import { FileDrop } from '@/components/FileDrop';
import { RecordPreviewTable } from '@/components/RecordPreviewTable';
import { IngestionForm } from '@/components/IngestionForm';
import { ApiTester } from '@/components/ApiTester';
import ApiConnectionStatus from '@/components/ApiConnectionStatus';
import EnhancedApiTester from '@/components/EnhancedApiTester';
import CorsStatus from '@/components/CorsStatus';
import { Database, Upload, Send, Building, Users } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type TableType = 'companies' | 'people';

const Index = () => {
  const [records, setRecords] = useState<Record<string, any>[]>([]);
  const [selectedTableType, setSelectedTableType] = useState<TableType>('companies');

  const handleDataParsed = (data: Record<string, any>[]) => {
    setRecords(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="bg-card shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <Database className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">IUT - Ingestion Uploader Template</h1>
                <p className="text-muted-foreground">Upload, preview, and send data to your Render API endpoint</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <CorsStatus />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Table Type Selection */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Select Data Type</h3>
                  <p className="text-sm text-muted-foreground">Choose the type of data you're uploading</p>
                </div>
              </div>
              
              <RadioGroup 
                value={selectedTableType} 
                onValueChange={(value: TableType) => setSelectedTableType(value)}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="companies" id="companies" />
                  <Label htmlFor="companies" className="flex items-center space-x-2 cursor-pointer">
                    <Building className="h-4 w-4" />
                    <span>Companies</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="people" id="people" />
                  <Label htmlFor="people" className="flex items-center space-x-2 cursor-pointer">
                    <Users className="h-4 w-4" />
                    <span>People</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border">
              <div className="p-2 bg-primary/10 rounded-full">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">1. Upload File</h3>
                <p className="text-sm text-muted-foreground">CSV, JSON, or Excel</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border">
              <div className="p-2 bg-info/10 rounded-full">
                <Database className="h-5 w-5 text-info" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">2. Preview Data</h3>
                <p className="text-sm text-muted-foreground">Verify records</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border">
              <div className="p-2 bg-success/10 rounded-full">
                <Send className="h-5 w-5 text-success" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">3. Send to API</h3>
                <p className="text-sm text-muted-foreground">Ingest to database</p>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <FileDrop onDataParsed={handleDataParsed} />

          {/* Data Preview */}
          {records.length > 0 && (
            <RecordPreviewTable records={records} />
          )}

          {/* Ingestion Form */}
          <IngestionForm records={records} tableType={selectedTableType} />
          
          {/* API Connection & Testing Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ApiConnectionStatus />
              <div className="lg:col-span-2">
                <EnhancedApiTester />
              </div>
            </div>
            <ApiTester />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
