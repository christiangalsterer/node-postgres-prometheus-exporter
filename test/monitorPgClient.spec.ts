import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { Client } from 'pg'
import { Registry } from 'prom-client'

import { monitorPgClient } from '../src/monitorPgClient'
import { PgClientPrometheusExporter } from '../src/pgClientPrometheusExporter'

jest.mock('../src/pgClientPrometheusExporter')
const mockPgClientPrometheusExporter = jest.mocked(PgClientPrometheusExporter)

describe('tests monitorPgClient', () => {
  const client: Client = new Client()
  let register: Registry

  beforeEach(() => {
    register = new Registry()
    mockPgClientPrometheusExporter.mockClear()
  })

  test('monitorPgClient calls PgClientPrometheusExporter with mandatory parameter', () => {
    monitorPgClient(client, register)
    expect(mockPgClientPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockPgClientPrometheusExporter).toHaveBeenCalledWith(client, register, undefined)
  })

  test('monitorPgClient calls PgClientPrometheusExporter with optional parameter', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    monitorPgClient(client, register, options)
    expect(mockPgClientPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockPgClientPrometheusExporter).toHaveBeenCalledWith(client, register, options)
  })

  test('calls PgClientPrometheusExporter with optional parameter undefined', () => {
    monitorPgClient(client, register, undefined)
    expect(mockPgClientPrometheusExporter).toHaveBeenCalledWith(client, register, undefined)
  })

  test('monitorPgClient calls methods of PgClientPrometheusExporter instance', () => {
    monitorPgClient(client, register)
    // eslint-disable-next-line @typescript-eslint/prefer-destructuring
    const mockPgClientPrometheusExporterInstance = mockPgClientPrometheusExporter.mock.instances[0]
    // eslint-disable-next-line jest/unbound-method, @typescript-eslint/no-unsafe-type-assertion
    const monitorEnableMetrics = mockPgClientPrometheusExporterInstance.enableMetrics as jest.Mock
    expect(monitorEnableMetrics).toHaveBeenCalledTimes(1)
  })

  test('monitorPgClient does not throw if called multiple times', () => {
    expect(() => {
      monitorPgClient(client, register)
      monitorPgClient(client, register)
      monitorPgClient(client, register)
    }).not.toThrow()
    expect(mockPgClientPrometheusExporter).toHaveBeenCalledTimes(3)
  })
})
