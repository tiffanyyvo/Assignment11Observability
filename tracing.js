const { resourceFromAttributes } = require('@opentelemetry/resources');
const { ATTR_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');
const { NodeSDK } = require('@opentelemetry/sdk-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');

const {
  PeriodicExportingMetricReader,
} = require('@opentelemetry/sdk-metrics');

// OTLP exporters (to send data to Jaeger)
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');

// Instrumentations
const { ExpressInstrumentation } =
  require("opentelemetry-instrumentation-express");
const { MongoDBInstrumentation } =
  require("@opentelemetry/instrumentation-mongodb");
const { HttpInstrumentation } =
  require("@opentelemetry/instrumentation-http");

// Export traces to Jaeger via OTLP over HTTP
const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces',
});

// Export metrics to Jaeger OTLP endpoint (Jaeger will just accept them)
const metricExporter = new OTLPMetricExporter({
  url: 'http://localhost:4318/v1/metrics',
});

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'todo-service',   // shows up as service name in Jaeger
  }),
  traceExporter: traceExporter,
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
  }),
  instrumentations: [
    getNodeAutoInstrumentations(),
    new ExpressInstrumentation(),
    new MongoDBInstrumentation(),
    new HttpInstrumentation(),
  ],
});

sdk.start();

// const { resourceFromAttributes } = require('@opentelemetry/resources');
// const { ATTR_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');
// const { NodeSDK } = require('@opentelemetry/sdk-node');
// const {
//   getNodeAutoInstrumentations,
// } = require('@opentelemetry/auto-instrumentations-node');
// const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
// const {
//   ConsoleMetricExporter,
//   PeriodicExportingMetricReader,
// } = require('@opentelemetry/sdk-metrics');

// // Instrumentations
// const { ExpressInstrumentation } =
//   require("opentelemetry-instrumentation-express");
// const { MongoDBInstrumentation } =
//   require("@opentelemetry/instrumentation-mongodb");
// const { HttpInstrumentation } =
//   require("@opentelemetry/instrumentation-http");

// const sdk = new NodeSDK({
//   resource: resourceFromAttributes({
//     [ATTR_SERVICE_NAME]: "todo-service",
//   }),
//   traceExporter: new ConsoleSpanExporter(), // print spans to console for now
//   metricReader: new PeriodicExportingMetricReader({
//     exporter: new ConsoleMetricExporter(), // print metrics to console
//   }),
//   instrumentations: [
//     getNodeAutoInstrumentations(),
//     new ExpressInstrumentation(),
//     new MongoDBInstrumentation(),
//     new HttpInstrumentation(),
//   ],
// });

// sdk.start();
