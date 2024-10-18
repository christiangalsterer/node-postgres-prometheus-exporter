import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import type { Pool } from 'pg'
import { Registry } from 'prom-client'

import { monitorPgPool } from '../src/monitorPgPool'
import { PgPoolPrometheusExporter } from '../src/pgPoolPrometheusExporter'

jest.mock('../src/pgPoolPrometheusExporter')
const mockPgPoolPrometheusExporter = jest.mocked(PgPoolPrometheusExporter)

describe('tests monitorPgPool', () => {
  let pool: Pool
  let register: Registry

  beforeEach(() => {
    register = new Registry()
    mockPgPoolPrometheusExporter.mockClear()
  })

  test('monitorPgPool calls PgPoolPrometheusExporter with mandatory parameter', () => {
    monitorPgPool(pool, register)
    expect(mockPgPoolPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockPgPoolPrometheusExporter).toHaveBeenCalledWith(pool, register, undefined)
  })

  test('monitorPgPool calls PgPoolPrometheusExporter with optional parameter', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    monitorPgPool(pool, register, options)
    expect(mockPgPoolPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockPgPoolPrometheusExporter).toHaveBeenCalledWith(pool, register, options)
  })

  test('monitorPgPool calls methods of PgPoolPrometheusExporter instance', () => {
    monitorPgPool(pool, register)
    // eslint-disable-next-line @typescript-eslint/prefer-destructuring
    const mockPgPoolPrometheusExporterInstance = mockPgPoolPrometheusExporter.mock.instances[0]
    // eslint-disable-next-line jest/unbound-method
    const monitorEnableMetrics = mockPgPoolPrometheusExporterInstance.enableMetrics as jest.Mock
    expect(monitorEnableMetrics).toHaveBeenCalledTimes(1)
  })
})
