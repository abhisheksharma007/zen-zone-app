import { useEffect } from 'react';

export function EnvTest() {
  useEffect(() => {
    // Log all VITE_ prefixed environment variables
    console.log('Environment Variables:');
    console.log('NODE_ENV:', import.meta.env.MODE);
    console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
    console.log('VITE_APP_URL:', import.meta.env.VITE_APP_URL);
    console.log('VITE_ENABLE_ANALYTICS:', import.meta.env.VITE_ENABLE_ANALYTICS);
    console.log('VITE_LOG_LEVEL:', import.meta.env.VITE_LOG_LEVEL);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Environment Variables Test</h2>
      <div className="space-y-2">
        <p><strong>Mode:</strong> {import.meta.env.MODE}</p>
        <p><strong>API URL:</strong> {import.meta.env.VITE_API_URL}</p>
        <p><strong>App URL:</strong> {import.meta.env.VITE_APP_URL}</p>
        <p><strong>Analytics Enabled:</strong> {import.meta.env.VITE_ENABLE_ANALYTICS}</p>
        <p><strong>Log Level:</strong> {import.meta.env.VITE_LOG_LEVEL}</p>
      </div>
    </div>
  );
} 