import { type Pool, type PoolClient } from 'pg'
import { Counter, Gauge, type Registry } from 'prom-client'

import { type PgPoolExporterOptions } from './pgPoolExporterOptions'
import { getDatabase, getHost, getMaxPoolSize, getPort, mergeLabelNamesWithStandardLabels, mergeLabelsWithStandardLabels } from './utils'

/**
 * Exports metrics for the pg.Pool module
 */
export class PgPoolPrometheusExporter {
  private readonly pool: Pool
  private readonly register: Registry
  private readonly options: PgPoolExporterOptions
  private readonly defaultOptions: PgPoolExporterOptions = {}

  private readonly poolMaxSize: number | undefined
  private readonly poolHost: string
  private readonly poolPort: number
  private readonly poolDatabase: string | undefined

  private readonly PG_POOL_CONNECTIONS_CREATED_TOTAL = 'pg_pool_connections_created_total'
  private readonly PG_POOL_SIZE = 'pg_pool_size'
  private readonly PG_POOL_MAX = 'pg_pool_max'
  private readonly PG_POOL_ACTIVE_CONNECTIONS = 'pg_pool_active_connections'
  private readonly PG_POOL_WAITING_CONNECTIONS = 'pg_pool_waiting_connections'
  private readonly PG_POOL_IDLE_CONNECTIONS = 'pg_pool_idle_connections'
  private readonly PG_POOL_ERRORS_TOTAL = 'pg_pool_errors_total'
  private readonly PG_POOL_CONNECTIONS_REMOVED_TOTAL = 'pg_pool_connections_removed_total'

  private readonly poolConnectionsCreatedTotal: Counter
  private readonly poolSize: Gauge
  private readonly poolSizeMax: Gauge
  private readonly poolErrors: Counter
  private readonly poolConnectionsRemovedTotal: Counter
  private readonly poolActiveConnections: Gauge
  private readonly poolWaitingConnections: Gauge
  private readonly poolIdleConnections: Gauge

  constructor(pool: Pool, register: Registry, options?: PgPoolExporterOptions) {
    this.pool = pool
    this.register = register
    this.options = { ...this.defaultOptions, ...options }

    this.poolConnectionsCreatedTotal = (this.register.getSingleMetric(this.PG_POOL_CONNECTIONS_CREATED_TOTAL) ??
      new Counter({
        name: this.PG_POOL_CONNECTIONS_CREATED_TOTAL,
        help: 'The total number of created connections.',
        labelNames: mergeLabelNamesWithStandardLabels(['host', 'database'], this.options.defaultLabels),
        registers: [this.register]
      })) as Counter

    this.poolSize = (this.register.getSingleMetric(this.PG_POOL_SIZE) ??
      new Gauge({
        name: this.PG_POOL_SIZE,
        help: 'The current size of the connection pool, including active and idle members.',
        labelNames: mergeLabelNamesWithStandardLabels(['host', 'database'], this.options.defaultLabels),
        registers: [this.register]
      })) as Gauge

    this.poolSizeMax = (this.register.getSingleMetric(this.PG_POOL_MAX) ??
      new Gauge({
        name: this.PG_POOL_MAX,
        help: 'The maximum size of the connection pool.',
        labelNames: mergeLabelNamesWithStandardLabels(['host', 'database'], this.options.defaultLabels),
        registers: [this.register],
        collect: () => {
          this.poolSizeMax.set(
            mergeLabelsWithStandardLabels(
              { host: this.poolHost + ':' + this.poolPort.toString(), database: this.poolDatabase },
              this.options.defaultLabels
            ),
            this.poolMaxSize!
          )
        }
      })) as Gauge

    this.poolActiveConnections = (this.register.getSingleMetric(this.PG_POOL_ACTIVE_CONNECTIONS) ??
      new Gauge({
        name: this.PG_POOL_ACTIVE_CONNECTIONS,
        help: 'The total number of active connections.',
        labelNames: mergeLabelNamesWithStandardLabels(['host', 'database'], this.options.defaultLabels),
        registers: [this.register]
      })) as Gauge

    this.poolWaitingConnections = (this.register.getSingleMetric(this.PG_POOL_WAITING_CONNECTIONS) ??
      new Gauge({
        name: this.PG_POOL_WAITING_CONNECTIONS,
        help: 'The total number of waiting connections.',
        labelNames: mergeLabelNamesWithStandardLabels(['host', 'database'], this.options.defaultLabels),
        registers: [this.register],
        collect: () => {
          this.poolWaitingConnections.set(
            mergeLabelsWithStandardLabels(
              { host: this.poolHost + ':' + this.poolPort.toString(), database: this.poolDatabase },
              this.options.defaultLabels
            ),
            this.pool.waitingCount
          )
        }
      })) as Gauge

    this.poolIdleConnections = (this.register.getSingleMetric(this.PG_POOL_IDLE_CONNECTIONS) ??
      new Gauge({
        name: this.PG_POOL_IDLE_CONNECTIONS,
        help: 'The total number of idle connections.',
        labelNames: mergeLabelNamesWithStandardLabels(['host', 'database'], this.options.defaultLabels),
        registers: [this.register],
        collect: () => {
          this.poolIdleConnections.set(
            mergeLabelsWithStandardLabels(
              { host: this.poolHost + ':' + this.poolPort.toString(), database: this.poolDatabase },
              this.options.defaultLabels
            ),
            this.pool.idleCount
          )
        }
      })) as Gauge

    this.poolErrors = (this.register.getSingleMetric(this.PG_POOL_ERRORS_TOTAL) ??
      new Counter({
        name: this.PG_POOL_ERRORS_TOTAL,
        help: 'The total number of connection errors with a database.',
        labelNames: mergeLabelNamesWithStandardLabels(['host', 'database', 'error'], this.options.defaultLabels),
        registers: [this.register]
      })) as Counter

    this.poolConnectionsRemovedTotal = (this.register.getSingleMetric(this.PG_POOL_CONNECTIONS_REMOVED_TOTAL) ??
      new Counter({
        name: this.PG_POOL_CONNECTIONS_REMOVED_TOTAL,
        help: 'The total number of removed connections.',
        labelNames: mergeLabelNamesWithStandardLabels(['host', 'database'], this.options.defaultLabels),
        registers: [this.register]
      })) as Counter

    this.poolMaxSize = getMaxPoolSize(pool)
    this.poolHost = getHost(pool)
    this.poolPort = getPort(pool)
    this.poolDatabase = getDatabase(pool)
  }

  public enableMetrics(): void {
    this.pool.on('connect', (client) => {
      this.onPoolConnect(client)
    })
    this.pool.on('acquire', (client) => {
      this.onPoolConnectionAcquired(client)
    })
    this.pool.on('error', (error) => {
      this.onPoolError(error)
    })
    this.pool.on('release', (error, client) => {
      this.onPoolConnectionReleased(error, client)
    })
    this.pool.on('remove', (client) => {
      this.onPoolConnectionRemoved(client)
    })
  }

  onPoolConnect(client: PoolClient): void {
    this.poolConnectionsCreatedTotal.inc(
      mergeLabelsWithStandardLabels({ host: this.poolHost + ':' + this.poolPort.toString(), database: this.poolDatabase }, this.options.defaultLabels)
    )
    this.poolSize.inc(
      mergeLabelsWithStandardLabels({ host: this.poolHost + ':' + this.poolPort.toString(), database: this.poolDatabase }, this.options.defaultLabels)
    )
  }

  onPoolConnectionAcquired(client: PoolClient): void {
    this.poolActiveConnections.inc(
      mergeLabelsWithStandardLabels({ host: this.poolHost + ':' + this.poolPort.toString(), database: this.poolDatabase }, this.options.defaultLabels)
    )
  }

  onPoolError(error: Error): void {
    this.poolErrors.inc(
      mergeLabelsWithStandardLabels(
        { host: this.poolHost + ':' + this.poolPort.toString(), database: this.poolDatabase, error: error.message },
        this.options.defaultLabels
      )
    )
  }

  onPoolConnectionReleased(_error: Error, client: PoolClient): void {
    this.poolActiveConnections.dec(
      mergeLabelsWithStandardLabels({ host: this.poolHost + ':' + this.poolPort.toString(), database: this.poolDatabase }, this.options.defaultLabels)
    )
  }

  onPoolConnectionRemoved(client: PoolClient): void {
    this.poolSize.dec(
      mergeLabelsWithStandardLabels({ host: this.poolHost + ':' + this.poolPort.toString(), database: this.poolDatabase }, this.options.defaultLabels)
    )
    this.poolConnectionsRemovedTotal.inc(
      mergeLabelsWithStandardLabels({ host: this.poolHost + ':' + this.poolPort.toString(), database: this.poolDatabase }, this.options.defaultLabels)
    )
  }
}
