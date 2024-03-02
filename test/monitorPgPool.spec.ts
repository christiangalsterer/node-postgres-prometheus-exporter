import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { Registry } from 'prom-client'

import { type Pool } from 'pg'
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

  test('tests if monitorPgPool called PgPoolPrometheusExporter with mandatory parameter', () => {
    monitorPgPool(pool, register)
    expect(mockPgPoolPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockPgPoolPrometheusExporter).toBeCalledWith(pool, register, undefined)
  })

  test('tests if monitorPgPool called PgPoolPrometheusExporter with optional parameter', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    monitorPgPool(pool, register, options)
    expect(mockPgPoolPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockPgPoolPrometheusExporter).toBeCalledWith(pool, register, options)
  })

  test('tests if monitorPgPool called methods of PgPoolPrometheusExporter instance', () => {
    monitorPgPool(pool, register)
    const mockPgPoolPrometheusExporterInstance = mockPgPoolPrometheusExporter.mock.instances[0]
    // eslint-disable-next-line jest/unbound-method
    const monitorEnableMetrics = mockPgPoolPrometheusExporterInstance.enableMetrics as jest.Mock
    expect(monitorEnableMetrics).toHaveBeenCalledTimes(1)
  })
})
