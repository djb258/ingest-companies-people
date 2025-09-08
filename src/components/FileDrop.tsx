import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseFile, parseGoogleSheetUrl, ParseResult } from '@/utils/parseCsv';
import { useToast } from '@/hooks/use-toast';

interface FileDropProps {
  onDataParsed: (data: Record<string, any>[]) => void;
}

export const FileDrop: React.FC<FileDropProps> = ({ onDataParsed }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [importedSheetName, setImportedSheetName] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedFile(file);

    try {
      const result: ParseResult = await parseFile(file);
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Parsing Error",
          description: result.error,
        });
        setUploadedFile(null);
      } else {
        toast({
          title: "File Parsed Successfully",
          description: `Loaded ${result.data.length} records from ${file.name}`,
        });
        onDataParsed(result.data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  }, [onDataParsed, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  const handleGoogleSheetImport = async () => {
    if (!googleSheetUrl.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a Google Sheets URL",
      });
      return;
    }

    setIsUploading(true);

    try {
      const result: ParseResult = await parseGoogleSheetUrl(googleSheetUrl);
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Import Error",
          description: result.error,
        });
      } else {
        const sheetName = googleSheetUrl.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1] || 'Google Sheet';
        setImportedSheetName(sheetName);
        toast({
          title: "Google Sheet Imported Successfully",
          description: `Loaded ${result.data.length} records from Google Sheets`,
        });
        onDataParsed(result.data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Import Error",
        description: error instanceof Error ? error.message : "Failed to import Google Sheet",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setImportedSheetName(null);
    setGoogleSheetUrl('');
    onDataParsed([]);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Import Data</h2>
          {(uploadedFile || importedSheetName) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFile}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {!uploadedFile && !importedSheetName ? (
          <Tabs defaultValue="file" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file">Upload File</TabsTrigger>
              <TabsTrigger value="sheets">Google Sheets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="file" className="mt-4">
          <div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-all duration-300 ease-in-out
              ${isDragActive 
                ? 'border-upload-zone-border bg-upload-zone-active shadow-upload' 
                : 'border-border bg-upload-zone hover:bg-upload-zone-active hover:border-upload-zone-border'
              }
              ${isUploading ? 'opacity-50 pointer-events-none' : ''}
            `}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-foreground">
                  {isDragActive ? 'Drop your file here' : 'Drop files here or click to browse'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports CSV, JSON, and Excel files (.csv, .json, .xlsx, .xls)
                </p>
              </div>
              {isUploading && (
                <div className="flex items-center justify-center space-x-2 text-primary">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm">Parsing file...</span>
                </div>
              )}
            </div>
          </div>
            </TabsContent>
            
            <TabsContent value="sheets" className="mt-4">
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Paste your Google Sheets share URL here..."
                      value={googleSheetUrl}
                      onChange={(e) => setGoogleSheetUrl(e.target.value)}
                      className="flex-1"
                      disabled={isUploading}
                    />
                    <Button
                      onClick={handleGoogleSheetImport}
                      disabled={isUploading || !googleSheetUrl.trim()}
                      className="shrink-0"
                    >
                      {isUploading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                          <span>Importing...</span>
                        </div>
                      ) : (
                        <>
                          <Link2 className="h-4 w-4 mr-2" />
                          Import
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Make sure your Google Sheet is publicly viewable or shared with "Anyone with the link"
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex items-center space-x-3 p-4 bg-success/10 border border-success/20 rounded-lg">
            <CheckCircle className="h-5 w-5 text-success" />
            {uploadedFile ? (
              <>
                <File className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </>
            ) : (
              <>
                <Link2 className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">Google Sheets Import</p>
                  <p className="text-sm text-muted-foreground">
                    Data imported successfully
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};