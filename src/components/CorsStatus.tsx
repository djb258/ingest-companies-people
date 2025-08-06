import { useEffect, useState } from 'react';
import { checkCorsHealth } from '@/utils/corsDebugger';

export default function CorsStatus() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkCorsHealth('https://render-marketing-db.onrender.com').then(setError);
  }, []);

  if (!error) return <div className="text-green-600">✅ CORS OK</div>;
  return (
    <div className="text-red-600 whitespace-pre-wrap bg-red-100 p-2 rounded">
      {error}
    </div>
  );
}