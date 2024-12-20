/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { beforeEach } from '@jest/globals'
import { Client } from 'pg'
import { Counter, type Registry } from 'prom-client'

import { PgClientPrometheusExporter } from '../src/pgClientPrometheusExporter'

jest.mock('prom-client', () => ({
  Counter: jest.fn(() => ({
    set: jest.fn(),
    get: jest.fn()
  }))
}))

describe('client metrics are created with the correct parameters', () => {
  const options = { defaultLabels: { foo: 'bar', alice: 2 } }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const register: Registry = {} as Registry
  const client = new Client()

  beforeEach(() => {
    jest.clearAllMocks()
    register.getSingleMetric = jest.fn(() => undefined)
  })

  test('client metrics are created', () => {
    // eslint-disable-next-line no-new
    new PgClientPrometheusExporter(client, register)

    expect(Counter).toHaveBeenCalledTimes(2)

    expect(Counter).toHaveBeenCalledWith({
      name: 'pg_client_errors_total',
      help: 'The total number of connection errors with a database.',
      labelNames: ['host', 'database'],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'pg_client_disconnects_total',
      help: 'The total number of disconnected connections.',
      labelNames: ['host', 'database'],
      registers: [register]
    })
  })

  test('client metrics are created with default labels', () => {
    // eslint-disable-next-line no-new
    new PgClientPrometheusExporter(client, register, options)

    expect(Counter).toHaveBeenCalledTimes(2)

    expect(Counter).toHaveBeenCalledWith({
      name: 'pg_client_errors_total',
      help: 'The total number of connection errors with a database.',
      labelNames: ['host', 'database', 'foo', 'alice'],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'pg_client_disconnects_total',
      help: 'The total number of disconnected connections.',
      labelNames: ['host', 'database', 'foo', 'alice'],
      registers: [register]
    })
  })
})
