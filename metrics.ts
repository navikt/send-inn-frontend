import { collectDefaultMetrics } from 'prom-client';

declare global {
  // eslint-disable-next-line no-var
  var _metrics: AppMetrics;
}

export class AppMetrics {
  constructor() {
    console.info('Initializing metrics client');

    collectDefaultMetrics();
  }
}

global._metrics = global._metrics || new AppMetrics();

export default global._metrics;
