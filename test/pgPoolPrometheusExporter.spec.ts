import { beforeEach, describe, expect, test } from '@jest/globals'
import { Pool } from 'pg'
import { Registry } from 'prom-client'

import { PgPoolPrometheusExporter } from '../src/pgPoolPrometheusExporter'

describe('tests PgPoolPrometheusExporter', () => {
  let register: Registry
  const pool = new Pool()
  const metrics: string[] = [
    'pg_pool_connections_created_total', 'pg_pool_size', 'pg_pool_max',
    'pg_pool_active_connections', 'pg_pool_waiting_connections', 'pg_pool_idle_connections',
    'pg_pool_errors_total', 'pg_pool_connections_removed_total'
  ]

  beforeEach(() => {
    register = new Registry()
  })

  test('metrics are registered in registry', () => {
    // eslint-disable-next-line no-new
    new PgPoolPrometheusExporter(pool, register)
    expect(register.getMetricsAsArray()).toHaveLength(metrics.length)
    metrics.forEach(metric => {
      expect(register.getSingleMetric(metric)).toBeDefined()
    })
  })

  test('metrics are registered in registry with defaultLabels', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    // eslint-disable-next-line no-new
    new PgPoolPrometheusExporter(pool, register, options)
    expect(register.getMetricsAsArray()).toHaveLength(metrics.length)
    metrics.forEach(metric => {
      expect(register.getSingleMetric(metric)).toBeDefined()
    })
  })
})
