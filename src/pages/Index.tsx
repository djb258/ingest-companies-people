import React, { useState } from 'react';
import { FileDrop } from '@/components/FileDrop';
import { RecordPreviewTable } from '@/components/RecordPreviewTable';
import { IngestionForm } from '@/components/IngestionForm';
import { Database, Upload, Send } from 'lucide-react';

const Index = () => {
  const [records, setRecords] = useState<Record<string, any>[]>([]);

  const handleDataParsed = (data: Record<string, any>[]) => {
    setRecords(data);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-card shadow-elegant border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-lg">
              <Database className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">IUT - Ingestion Uploader Template</h1>
              <p className="text-muted-foreground">Upload, preview, and send data to your Render API endpoint</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
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
          <IngestionForm records={records} />
        </div>
      </div>
    </div>
  );
};

export default Index;
