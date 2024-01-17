import { beforeEach, describe, expect, test } from '@jest/globals'
import { Registry } from 'prom-client'

import { PgPoolPrometheusExporter } from '../src/pgPoolPrometheusExporter'
import { Pool } from 'pg'

describe('tests PgPoolPrometheusExporter', () => {
  let register: Registry
  const pool = new Pool()

  beforeEach(() => {
    register = new Registry()
  })

  test('test if all metrics are registered in registry', () => {
    // eslint-disable-next-line no-new
    new PgPoolPrometheusExporter(pool, register)
    expect(register.getSingleMetric('pg_pool_connections_created_total')).toBeDefined()
    expect(register.getSingleMetric('pg_pool_size')).toBeDefined()
    expect(register.getSingleMetric('pg_pool_max')).toBeDefined()
    expect(register.getSingleMetric('pg_pool_active_connections')).toBeDefined()
    expect(register.getSingleMetric('pg_pool_waiting_connections')).toBeDefined()
    expect(register.getSingleMetric('pg_pool_idle_connections')).toBeDefined()
    expect(register.getSingleMetric('pg_pool_errors_total')).toBeDefined()
    expect(register.getSingleMetric('pg_pool_connections_removed_total')).toBeDefined()
    expect(register.getMetricsAsArray().length).toBe(8)
  })

  test('test if all metrics are registered in registry with defaultLabels', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    // eslint-disable-next-line no-new
    new PgPoolPrometheusExporter(pool, register, options)
    expect(register.getSingleMetric('pg_pool_connections_created_total')).toBeDefined()
    expect(register.getSingleMetric('pg_pool_size')).toBeDefined()
    expect(register.getSingleMetric('pg_pool_max')).toBeDefined()
    expect(register.getSingleMetric('pg_pool_active_connections')).toBeDefined()
    expect(register.getSingleMetric('pg_pool_waiting_connections')).toBeDefined()
    expect(register.getSingleMetric('pg_pool_idle_connections')).toBeDefined()
    expect(register.getSingleMetric('pg_pool_errors_total')).toBeDefined()
    expect(register.getSingleMetric('pg_pool_connections_removed_total')).toBeDefined()
    expect(register.getMetricsAsArray().length).toBe(8)
  })
})
