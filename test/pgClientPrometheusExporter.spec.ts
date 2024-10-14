import { beforeEach, describe, expect, test } from '@jest/globals'
import { Client } from 'pg'
import { Registry } from 'prom-client'

import { PgClientPrometheusExporter } from '../src/pgClientPrometheusExporter'

const clientEvents: string[] = ['end', 'error']

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

  test('metrics are registered only once and taken from the registry', () => {
    // eslint-disable-next-line no-new
    new PgClientPrometheusExporter(client, register)
    // eslint-disable-next-line no-new
    new PgClientPrometheusExporter(client, register)
    expect(register.getMetricsAsArray()).toHaveLength(metrics.length)
    metrics.forEach((metric) => {
      expect(register.getSingleMetric(metric)).toBeDefined()
    })
  })

  test.each(clientEvents)('metrics are emitted with default labels for event "%s"', async (event) => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    const expectedLabels = { foo: 'bar', alice: 2 }
    const exporter = new PgClientPrometheusExporter(client, register, options)
    const mockEvent = {}
    exporter.enableMetrics()
    client.emit(event, mockEvent)

    const metrics = await register.getMetricsAsJSON()
    for (const metric of metrics) {
      for (const value of metric.values) {
        console.log(value)
        expect(value.labels).toMatchObject(expectedLabels)
      }
    }
  })
})
