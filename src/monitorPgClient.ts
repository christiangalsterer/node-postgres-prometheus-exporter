import type { Client } from 'pg'
import type { Registry } from 'prom-client'

import type { PgClientExporterOptions } from './pgClientExporterOptions'
import { PgClientPrometheusExporter } from './pgClientPrometheusExporter'

/**
 * Exposes metrics for a pg.client in prometheus format.
 *
 * @param client The pg client to monitor.
 * @param options Optional parameter to configure the exporter
 */
export function monitorPgClient(client: Client, register: Registry, options?: PgClientExporterOptions): void {
  const exporter = new PgClientPrometheusExporter(client, register, options)
  exporter.enableMetrics()
}
