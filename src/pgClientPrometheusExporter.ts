import { type Client } from 'pg'
import { Counter, type Registry } from 'prom-client'

import { type PgClientExporterOptions } from './pgClientExporterOptions'
import { mergeLabelNamesWithStandardLabels, mergeLabelsWithStandardLabels } from './utils'

/**
 * Exports metrics for the pg.Client module
 */
export class PgClientPrometheusExporter {
  private readonly client: Client
  private readonly register: Registry
  private readonly options: PgClientExporterOptions
  private readonly defaultOptions: PgClientExporterOptions = {}

  private readonly PG_CLIENT_ERRORS_TOTAL = 'pg_client_errors_total'
  private readonly PG_CLIENT_DISCONNECTS_TOTAL = 'pg_client_disconnects_total'
  private readonly clientErrors: Counter
  private readonly clientDisconnects: Counter

  constructor(client: Client, register: Registry, options?: PgClientExporterOptions) {
    this.client = client
    this.register = register
    this.options = { ...this.defaultOptions, ...options }

    this.clientErrors = (this.register.getSingleMetric(this.PG_CLIENT_ERRORS_TOTAL) ??
      new Counter({
        name: this.PG_CLIENT_ERRORS_TOTAL,
        help: 'The total number of connection errors with a database.',
        labelNames: mergeLabelNamesWithStandardLabels(['host', 'database'], this.options.defaultLabels),
        registers: [this.register]
      })) as Counter

    this.clientDisconnects = (this.register.getSingleMetric(this.PG_CLIENT_DISCONNECTS_TOTAL) ??
      new Counter({
        name: this.PG_CLIENT_DISCONNECTS_TOTAL,
        help: 'The total number of disconnected connections.',
        labelNames: mergeLabelNamesWithStandardLabels(['host', 'database'], this.options.defaultLabels),
        registers: [this.register]
      })) as Counter
  }

  public enableMetrics(): void {
    this.client.on('error', (error) => {
      this.onClientError(error)
    })
    this.client.on('end', () => {
      this.onClientEnd()
    })
  }

  onClientError(_error: Error): void {
    this.clientErrors.inc(
      mergeLabelsWithStandardLabels(
        { host: this.client.host + ':' + this.client.port.toString(), database: this.client.database! },
        this.options.defaultLabels
      )
    )
  }

  onClientEnd(): void {
    this.clientDisconnects.inc(
      mergeLabelsWithStandardLabels(
        { host: this.client.host + ':' + this.client.port.toString(), database: this.client.database! },
        this.options.defaultLabels
      )
    )
  }
}
