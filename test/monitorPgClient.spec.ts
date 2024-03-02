import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { Registry } from 'prom-client'

import { type Client } from 'pg'
import { monitorPgClient } from '../src/monitorPgClient'
import { PgClientPrometheusExporter } from '../src/pgClientPrometheusExporter'

jest.mock('../src/pgClientPrometheusExporter')
const mockPgClientPrometheusExporter = jest.mocked(PgClientPrometheusExporter)

describe('tests monitorPgClient', () => {
  let client: Client
  let register: Registry

  beforeEach(() => {
    register = new Registry()
    mockPgClientPrometheusExporter.mockClear()
  })

  test('tests if monitorPgClient called PgClientPrometheusExporter with mandatory parameter', () => {
    monitorPgClient(client, register)
    expect(mockPgClientPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockPgClientPrometheusExporter).toBeCalledWith(client, register, undefined)
  })

  test('tests if monitorPgClient called PgClientPrometheusExporter with optional parameter', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    monitorPgClient(client, register, options)
    expect(mockPgClientPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockPgClientPrometheusExporter).toBeCalledWith(client, register, options)
  })

  test('tests if monitorPgClient called methods of PgClientPrometheusExporter instance', () => {
    monitorPgClient(client, register)
    const mockPgClientPrometheusExporterInstance = mockPgClientPrometheusExporter.mock.instances[0]
    // eslint-disable-next-line jest/unbound-method
    const monitorEnableMetrics = mockPgClientPrometheusExporterInstance.enableMetrics as jest.Mock
    expect(monitorEnableMetrics).toHaveBeenCalledTimes(1)
  })
})
