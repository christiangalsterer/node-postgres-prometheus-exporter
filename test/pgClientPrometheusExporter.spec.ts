import { beforeEach, describe, expect, test } from '@jest/globals'
import { Registry } from 'prom-client'

import { PgClientPrometheusExporter } from '../src/pgClientPrometheusExporter'
import { Client } from 'pg'

describe('tests pgClientPrometheusExporter', () => {
  let register: Registry
  const client = new Client()

  beforeEach(() => {
    register = new Registry()
  })

  test('test if all metrics are registered in registry', () => {
    // eslint-disable-next-line no-new
    new PgClientPrometheusExporter(client, register)
    expect(register.getSingleMetric('pg_client_errors_total')).toBeDefined()
    expect(register.getSingleMetric('pg_client_disconnects_total')).toBeDefined()
    expect(register.getMetricsAsArray().length).toBe(2)
  })

  test('test if all metrics are registered in registry with defaultLabels', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    // eslint-disable-next-line no-new
    new PgClientPrometheusExporter(client, register, options)
    expect(register.getSingleMetric('pg_client_errors_total')).toBeDefined()
    expect(register.getSingleMetric('pg_client_disconnects_total')).toBeDefined()
    expect(register.getMetricsAsArray().length).toBe(2)
  })
})
