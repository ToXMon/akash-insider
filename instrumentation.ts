// This file provides OpenTelemetry instrumentation for the application
// It's only active in Node.js environments and provides a no-op for Edge Runtime

// Import types without importing the actual modules
import type { NodeSDK as NodeSDKType } from '@opentelemetry/sdk-node';
import type { Resource as ResourceType } from '@opentelemetry/resources';
import type { MeterProvider as MeterProviderType, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

interface MeterProviderInterface {
  export: () => Promise<{
    headers: Record<string, string>;
    statusCode: number;
    contentType: string;
    metrics: string;
  }>;
}

interface SdkInterface {
  meterProvider?: MeterProviderInterface;
  start: () => Promise<void>;
  shutdown: () => Promise<void>;
}

// Check if we're in a Node.js environment
const isNodeEnvironment = (): boolean => {
  try {
    return (
      typeof process !== 'undefined' && 
      typeof process.versions?.node === 'string' &&
      !('webcontainer' in process.versions)
    );
  } catch (e) {
    return false;
  }
};

// Initialize as null - will be set in Node.js environment
let sdk: SdkInterface | null = null;

// Only run in Node.js environment
if (isNodeEnvironment()) {
  // Use an IIFE to handle async initialization
  (async () => {
    try {
      // Dynamic imports for Node.js only modules
      const { NodeSDK } = await import('@opentelemetry/sdk-node');
      const { OTLPMetricExporter } = await import('@opentelemetry/exporter-metrics-otlp-http');
      const { getNodeAutoInstrumentations } = await import('@opentelemetry/auto-instrumentations-node');
      const { MeterProvider, PeriodicExportingMetricReader } = await import('@opentelemetry/sdk-metrics');
      const { SemanticResourceAttributes } = await import('@opentelemetry/semantic-conventions');
      
      // Import the resources module - using require to avoid ESM issues
      const resources = require('@opentelemetry/resources');
      // Get the Resource class from the module
      const Resource = resources.Resource || resources.default?.Resource;
      if (!Resource) {
        throw new Error('Failed to load OpenTelemetry Resource class');
      }

      // Create resource
      const resource = new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'akash-insiders',
      });

      // Create a meter provider for metrics
      const meterProvider = new MeterProvider({
        resource,
      });

      // Create the OpenTelemetry Node SDK
      const _sdk = new NodeSDK({
        resource,
        instrumentations: [getNodeAutoInstrumentations()],
      });

      // Add metric reader if metrics are enabled
      if (process.env.OTEL_METRICS_ENABLED !== 'false') {
        const metricExporter = new OTLPMetricExporter();
        const metricReader = new PeriodicExportingMetricReader({
          exporter: metricExporter,
          exportIntervalMillis: 10000,
        });

        // @ts-ignore - addMetricReader is not in the type definitions but exists in the runtime
        meterProvider.addMetricReader(metricReader);
      }

      // Create the SDK instance with proper typing
      const wrappedSdk: SdkInterface = {
        meterProvider: meterProvider as unknown as MeterProviderInterface,
        start: async () => {
          await _sdk.start();
          console.log('OpenTelemetry SDK initialized');
        },
        shutdown: async () => {
          await _sdk.shutdown();
          console.log('OpenTelemetry SDK shut down');
        },
      };

      // Start the SDK
      await wrappedSdk.start();
      sdk = wrappedSdk;

      // Handle graceful shutdown - only in Node.js environment
      if (typeof process !== 'undefined' && process.on) {
        const handleShutdown = async () => {
          try {
            if (sdk?.shutdown) {
              await sdk.shutdown();
            }
            console.log('OpenTelemetry SDK shut down successfully');
            process.exit(0);
          } catch (error) {
            console.error('Error shutting down OpenTelemetry SDK:', error);
            process.exit(1);
          }
        };

        // Register shutdown handlers
        process.on('SIGTERM', handleShutdown);
        process.on('SIGINT', handleShutdown);
      }
    } catch (error) {
      console.error('Failed to initialize OpenTelemetry SDK:', error);
    }
  })();
}

// Export a no-op for non-Node environments (Edge Runtime)
if (!sdk) {
  sdk = {
    meterProvider: {
      export: async () => ({
        headers: {},
        statusCode: 200,
        contentType: 'text/plain',
        metrics: '# No metrics available in Edge Runtime\n',
      }),
    },
    start: async () => {},
    shutdown: async () => {},
  };
}

export { sdk };
