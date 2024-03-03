/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { beforeEach } from '@jest/globals'
import { Pool } from 'pg'
import { Counter, Gauge, type Registry } from 'prom-client'

import { PgPoolPrometheusExporter } from '../src/pgPoolPrometheusExporter'

jest.mock('prom-client', () => ({
  Counter: jest.fn(() => {
    return {
      set: jest.fn(),
      get: jest.fn()
    }
  }),
  Gauge: jest.fn(() => {
    return {
      set: jest.fn(),
      get: jest.fn()
    }
  })
}))

describe('test if all metrics are created with the correct parameters', () => {
  const options = { defaultLabels: { foo: 'bar', alice: 2 } }
  const register: Registry = {} as Registry
  const pool = new Pool()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('tests if all pool metrics are created', () => {
    // eslint-disable-next-line no-new
    new PgPoolPrometheusExporter(pool, register)

    expect(Counter).toHaveBeenCalledTimes(3)
    expect(Gauge).toHaveBeenCalledTimes(5)

    expect(Counter).toHaveBeenCalledWith({
      name: 'pg_pool_connections_created_total',
      help: 'The total number of created connections.',
      labelNames: ['host', 'database'],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'pg_pool_size',
      help: 'The current size of the connection pool, including active and idle members.',
      labelNames: ['host', 'database'],
      registers: [register]
    })

    // expect(Gauge).toHaveBeenCalledWith({
    //   name: 'pg_pool_max',
    //   help: 'The maximum size of the connection pool.',
    //   labelNames: ['host', 'database'],
    //   registers: [register]
    // })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'pg_pool_active_connections',
      help: 'The total number of active connections.',
      labelNames: ['host', 'database'],
      registers: [register]
    })

    // expect(Gauge).toHaveBeenCalledWith({
    //   name: 'pg_pool_waiting_connections',
    //   help: 'The total number of waiting connections.',
    //   labelNames: ['host', 'database'],
    //   registers: [register]
    // })

    // expect(Gauge).toHaveBeenCalledWith({
    //   name: 'pg_pool_idle_connections',
    //   help: 'The total number of idle connections.',
    //   labelNames: ['host', 'database'],
    //   registers: [register]
    // })

    expect(Counter).toHaveBeenCalledWith({
      name: 'pg_pool_errors_total',
      help: 'The total number of connection errors with a database.',
      labelNames: ['host', 'database', 'error'],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'pg_pool_connections_removed_total',
      help: 'The total number of removed connections.',
      labelNames: ['host', 'database'],
      registers: [register]
    })
  })

  test('tests if all pool metrics are created with default labels', () => {
    // eslint-disable-next-line no-new
    new PgPoolPrometheusExporter(pool, register, options)

    expect(Counter).toHaveBeenCalledTimes(3)
    expect(Gauge).toHaveBeenCalledTimes(5)

    expect(Counter).toHaveBeenCalledWith({
      name: 'pg_pool_connections_created_total',
      help: 'The total number of created connections.',
      labelNames: ['host', 'database', 'foo', 'alice'],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'pg_pool_size',
      help: 'The current size of the connection pool, including active and idle members.',
      labelNames: ['host', 'database', 'foo', 'alice'],
      registers: [register]
    })

    // expect(Gauge).toHaveBeenCalledWith({
    //   name: 'pg_pool_max',
    //   help: 'The maximum size of the connection pool.',
    //   labelNames: ['host', 'database', 'foo', 'alice'],
    //   registers: [register]
    // })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'pg_pool_active_connections',
      help: 'The total number of active connections.',
      labelNames: ['host', 'database', 'foo', 'alice'],
      registers: [register]
    })

    // expect(Gauge).toHaveBeenCalledWith({
    //   name: 'pg_pool_waiting_connections',
    //   help: 'The total number of waiting connections.',
    //   labelNames: ['host', 'database', 'foo', 'alice'],
    //   registers: [register]
    // })

    // expect(Gauge).toHaveBeenCalledWith({
    //   name: 'pg_pool_idle_connections',
    //   help: 'The total number of idle connections.',
    //   labelNames: ['host', 'database', 'foo', 'alice'],
    //   registers: [register]
    // })

    expect(Counter).toHaveBeenCalledWith({
      name: 'pg_pool_errors_total',
      help: 'The total number of connection errors with a database.',
      labelNames: ['host', 'database', 'error', 'foo', 'alice'],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'pg_pool_connections_removed_total',
      help: 'The total number of removed connections.',
      labelNames: ['host', 'database', 'foo', 'alice'],
      registers: [register]
    })
  })
})
