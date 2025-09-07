import { NextResponse } from 'next/server';

// Force this route to use Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Use dynamic import to only load Node.js modules when running in Node.js
const getSdk = async () => {
  // Only import the SDK in Node.js environment
  if (typeof process === 'undefined' || !process.versions?.node) {
    return null;
  }
  
  try {
    const { sdk } = await import('../../../instrumentation');
    return sdk;
  } catch (error) {
    console.error('Failed to initialize OpenTelemetry SDK:', error);
    return null;
  }
};

export async function GET() {
  const sdk = await getSdk();
  
  if (!sdk?.meterProvider) {
    return new NextResponse('Metrics not available in this environment', { 
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  try {
    const { statusCode = 200, contentType = 'text/plain', metrics } = 
      await sdk.meterProvider.export();
      
    return new NextResponse(metrics || '# No metrics available\n', {
      status: statusCode,
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    console.error('Error exporting metrics:', error);
    return new NextResponse('Error exporting metrics', { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
