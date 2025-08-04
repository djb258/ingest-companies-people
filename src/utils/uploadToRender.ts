export interface UploadResponse {
  inserted: number;
  failed: number;
  schema_hash?: string;
  source?: string;
  errors?: string[];
}

export interface UploadRequest {
  records: Record<string, any>[];
  target_table?: string;
}

export const uploadToRender = async (
  endpoint: string, 
  data: UploadRequest
): Promise<UploadResponse> => {
  try {
    const response = await fetch(`${endpoint}/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
    throw new Error('Upload failed: Unknown error');
  }
};