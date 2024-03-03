import { type Pool } from 'pg'
import { type Registry } from 'prom-client'

import { type PgPoolExporterOptions } from './pgPoolExporterOptions'
import { PgPoolPrometheusExporter } from './pgPoolPrometheusExporter'

/**
 * Exposes metrics for a pg.pool in prometheus format.
 *
 * @param client The pg pool to monitor.
 * @param options Optional parameter to configure the exporter
 */
export function monitorPgPool (pool: Pool, register: Registry, options?: PgPoolExporterOptions): void {
  const exporter = new PgPoolPrometheusExporter(pool, register, options)
  exporter.enableMetrics()
}
