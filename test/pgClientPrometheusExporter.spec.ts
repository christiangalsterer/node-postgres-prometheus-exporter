import { beforeEach, describe, expect, test } from '@jest/globals'
import { Client } from 'pg'
import { Registry } from 'prom-client'

import { PgClientPrometheusExporter } from '../src/pgClientPrometheusExporter'

describe('tests pgClientPrometheusExporter', () => {
  let register: Registry
  const client = new Client()
  const metrics: string[] = ['pg_client_errors_total', 'pg_client_disconnects_total']

  beforeEach(() => {
    register = new Registry()
  })

  test('metrics are registered in registry', () => {
    // eslint-disable-next-line no-new
    new PgClientPrometheusExporter(client, register)
    expect(register.getMetricsAsArray()).toHaveLength(metrics.length)
    metrics.forEach((metric) => {
      expect(register.getSingleMetric(metric)).toBeDefined()
    })
  })

  test('metrics are registered in registry with defaultLabels', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    // eslint-disable-next-line no-new
    new PgClientPrometheusExporter(client, register, options)
    expect(register.getMetricsAsArray()).toHaveLength(metrics.length)
    metrics.forEach((metric) => {
      expect(register.getSingleMetric(metric)).toBeDefined()
    })
  })
})
