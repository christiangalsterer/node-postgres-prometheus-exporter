import { type Registry, Counter, Gauge } from 'prom-client'
import { type Pool, type PoolClient } from 'pg'
import { type PgPoolExporterOptions } from './pgPoolExporterOptions'
import { mergeLabelNamesWithStandardLabels, mergeLabelsWithStandardLabels } from './utils'

/**
 * Exports metrics for the pg.Pool module
 */
export class PgPoolPrometheusExporter {
  private readonly pool: Pool
  private readonly register: Registry
  private readonly options: PgPoolExporterOptions
  private readonly defaultOptions: PgPoolExporterOptions = {}

  private readonly poolMaxSize: number | undefined
  private readonly poolHost: string | undefined
  private readonly poolPort: number | undefined
  private readonly poolDatabase: string | undefined

  private readonly poolConnectionsCreatedTotal: Counter
  private readonly poolSize: Gauge
  private readonly poolSizeMax: Gauge
  private readonly poolErrors: Counter
  private readonly poolConnectionsRemovedTotal: Counter
  private readonly poolActiveConnections: Gauge
  private readonly poolWaitingConnections: Gauge
  private readonly poolIdleConnections: Gauge

  constructor (pool: Pool, register: Registry, options?: PgPoolExporterOptions) {
    this.pool = pool
    this.register = register
    this.options = { ...this.defaultOptions, ...options }

    this.poolConnectionsCreatedTotal = new Counter({
      name: 'pg_pool_connections_created_total',
      help: 'The total number of created connections.',
      labelNames: mergeLabelNamesWithStandardLabels(['host', 'database'], this.options.defaultLabels),
      registers: [this.register]
    })

    this.poolSize = new Gauge({
      name: 'pg_pool_size',
      help: 'The current size of the connection pool, including actice and idle members.',
      labelNames: mergeLabelNamesWithStandardLabels(['host', 'database'], this.options.defaultLabels),
      registers: [this.register]
    })

    this.poolSizeMax = new Gauge({
      name: 'pg_pool_max',
      help: 'The maximum size of the connection pool.',
      labelNames: mergeLabelNamesWithStandardLabels(['host', 'database'], this.options.defaultLabels),
      registers: [this.register],
      collect: () => {
        this.poolSizeMax.set(mergeLabelsWithStandardLabels({ host: this.poolHost + ':' + this.poolPort, database: this.poolDatabase }, this.options.defaultLabels), this.poolMaxSize!)
      }
    })

    this.poolActiveConnections = new Gauge({
      name: 'pg_pool_active_connections',
      help: 'The total number of active connections.',
      labelNames: mergeLabelNamesWithStandardLabels(['host', 'database'], this.options.defaultLabels),
      registers: [this.register]
    })

    this.poolWaitingConnections = new Gauge({
      name: 'pg_pool_waiting_connections',
      help: 'The total number of waiting connections.',
      labelNames: mergeLabelNamesWithStandardLabels(['host', 'database'], this.options.defaultLabels),
      registers: [this.register],
      collect: () => {
        this.poolWaitingConnections.set(mergeLabelsWithStandardLabels({ host: this.poolHost + ':' + this.poolPort, database: this.poolDatabase }, this.options.defaultLabels), this.pool.waitingCount)
      }
    })

    this.poolIdleConnections = new Gauge({
      name: 'pg_pool_idle_connections',
      help: 'The total number of idle connections.',
      labelNames: mergeLabelNamesWithStandardLabels(['host', 'database'], this.options.defaultLabels),
      registers: [this.register],
      collect: () => {
        this.poolIdleConnections.set(mergeLabelsWithStandardLabels({ host: this.poolHost + ':' + this.poolPort, database: this.poolDatabase }, this.options.defaultLabels), this.pool.idleCount)
      }
    })

    this.poolErrors = new Counter({
      name: 'pg_pool_errors_total',
      help: 'The total number of connection errors with a database.',
      labelNames: mergeLabelNamesWithStandardLabels(['host', 'database', 'error'], this.options.defaultLabels),
      registers: [this.register]
    })

    this.poolConnectionsRemovedTotal = new Counter({
      name: 'pg_pool_connections_removed_total',
      help: 'The total number of removed connections.',
      labelNames: mergeLabelNamesWithStandardLabels(['host', 'database'], this.options.defaultLabels),
      registers: [this.register]
    })

    this.poolMaxSize = this.getMaxPoolSize(pool)
    this.poolHost = this.getHost(pool)
    this.poolPort = this.getPort(pool)
    this.poolDatabase = this.getDatabase(pool)
  }

  public enableMetrics (): void {
    this.pool.on('connect', client => { this.onPoolConnect(client) })
    this.pool.on('acquire', client => { this.onPoolConnectionAcquired(client) })
    this.pool.on('error', error => { this.onPoolError(error) })
    this.pool.on('release', (error, client) => { this.onPoolConnectionReleased(error, client) })
    this.pool.on('remove', client => { this.onPoolConnectionRemoved(client) })
  }

  onPoolConnect (client: PoolClient): void {
    this.poolConnectionsCreatedTotal.inc(mergeLabelsWithStandardLabels({ host: this.poolHost + ':' + this.poolPort, database: this.poolDatabase }, this.options.defaultLabels))
    this.poolSize.inc(mergeLabelsWithStandardLabels({ host: this.poolHost + ':' + this.poolPort, database: this.poolDatabase }, this.options.defaultLabels))
  }

  onPoolConnectionAcquired (client: PoolClient): void {
    this.poolActiveConnections.inc(mergeLabelsWithStandardLabels({ host: this.poolHost + ':' + this.poolPort, database: this.poolDatabase }, this.options.defaultLabels))
  }

  onPoolError (error: Error): void {
    this.poolErrors.inc(mergeLabelsWithStandardLabels({ host: this.poolHost + ':' + this.poolPort, database: this.poolDatabase, error: error.message }, this.options.defaultLabels))
  }

  onPoolConnectionReleased (_error: Error, client: PoolClient): void {
    this.poolActiveConnections.dec(mergeLabelsWithStandardLabels({ host: this.poolHost + ':' + this.poolPort, database: this.poolDatabase }, this.options.defaultLabels))
  }

  onPoolConnectionRemoved (client: PoolClient): void {
    this.poolSize.dec(mergeLabelsWithStandardLabels({ host: this.poolHost + ':' + this.poolPort, database: this.poolDatabase }, this.options.defaultLabels))
    this.poolConnectionsRemovedTotal.inc(mergeLabelsWithStandardLabels({ host: this.poolHost + ':' + this.poolPort, database: this.poolDatabase }, this.options.defaultLabels))
  }

  private getMaxPoolSize (pool: Pool): number | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return (pool as any).options?.max
  }

  private getHost (pool: Pool): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return (pool as any).options?.host
  }

  private getPort (pool: Pool): number | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return (pool as any).options?.port
  }

  private getDatabase (pool: Pool): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return (pool as any).options?.database
  }
}
