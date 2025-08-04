import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface RecordPreviewTableProps {
  records: Record<string, any>[];
}

export const RecordPreviewTable: React.FC<RecordPreviewTableProps> = ({ records }) => {
  if (records.length === 0) {
    return null;
  }

  const previewRecords = records.slice(0, 10);
  const columns = records.length > 0 ? Object.keys(records[0]) : [];

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Data Preview</h2>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-info/10 text-info border-info/20">
              {records.length} total records
            </Badge>
            <Badge variant="secondary" className="bg-muted">
              Showing first 10
            </Badge>
          </div>
        </div>

        <ScrollArea className="w-full">
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className="px-4 py-3 text-left text-sm font-medium text-muted-foreground border-b"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRecords.map((record, rowIndex) => (
                  <tr key={rowIndex} className="border-b last:border-b-0 hover:bg-muted/25">
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className="px-4 py-3 text-sm text-foreground max-w-[200px]">
                        <div className="truncate" title={String(record[column] || '')}>
                          {record[column] !== null && record[column] !== undefined
                            ? String(record[column])
                            : (
                              <span className="text-muted-foreground italic">null</span>
                            )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>

        {records.length > 10 && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              ... and {records.length - 10} more records
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};