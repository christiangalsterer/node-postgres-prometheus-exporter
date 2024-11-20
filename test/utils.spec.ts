import { describe, expect, test } from '@jest/globals'

import { getDatabase, getHost, getMaxPoolSize, getPort, mergeLabelNamesWithStandardLabels, mergeLabelsWithStandardLabels } from '../src/utils'

describe('tests mergeLabelNamesWithStandardLabels', () => {
  const defaultLabels = { foo: 'bar', alice: 3 }
  const labels = ['label1', 'label2']
  const emptylabels = []

  test('mergeLabelNamesWithStandardLabels with no default labels', () => {
    expect(mergeLabelNamesWithStandardLabels(labels)).toStrictEqual(labels)
  })

  test('mergeLabelNamesWithStandardLabels with empty labels and no default labels', () => {
    expect(mergeLabelNamesWithStandardLabels(emptylabels)).toStrictEqual([])
  })

  test('mergeLabelNamesWithStandardLabels with default labels', () => {
    expect(mergeLabelNamesWithStandardLabels(labels, defaultLabels)).toStrictEqual(['label1', 'label2', 'foo', 'alice'])
  })

  test('mergeLabelNamesWithStandardLabels with empty labels and default labels', () => {
    expect(mergeLabelNamesWithStandardLabels(emptylabels, defaultLabels)).toStrictEqual(['foo', 'alice'])
  })
})

describe('tests mergeLabelsWithStandardLabels', () => {
  const defaultLabels = { foo: 'bar', alice: 3 }
  const labels = { label1: 'value1', label2: 2, label3: undefined }
  const emptyLabels = {}

  test('mergeLabelsWithStandardLabels with labels and no default labels', () => {
    expect(mergeLabelsWithStandardLabels(labels)).toStrictEqual({ label1: 'value1', label2: 2 })
  })

  test('mergeLabelsWithStandardLabels with empty labels and no default labels', () => {
    expect(mergeLabelsWithStandardLabels(emptyLabels)).toStrictEqual(emptyLabels)
  })

  test('mergeLabelsWithStandardLabels with labels and default labels', () => {
    expect(mergeLabelsWithStandardLabels(labels, defaultLabels)).toStrictEqual({ label1: 'value1', label2: 2, foo: 'bar', alice: 3 })
  })

  test('mergeLabelsWithStandardLabels with empty labels and default labels', () => {
    expect(mergeLabelsWithStandardLabels(emptyLabels, defaultLabels)).toStrictEqual(defaultLabels)
  })
})

describe('tests getMaxPoolSize', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const undefinedPool: any = { options: undefined }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const undefinedMax: any = { options: { max: undefined } }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const definedMax: any = { options: { max: 5 } }

  test.skip('getMaxPoolSize with undefined pool', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getMaxPoolSize(undefinedPool)).toBeUndefined()
  })

  test('getMaxPoolSize with undefined max', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getMaxPoolSize(undefinedMax)).toBeUndefined()
  })

  test('getMaxPoolSize with defined max', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getMaxPoolSize(definedMax)).toBe(5)
  })
})

describe('tests getHost', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const undefinedPool: any = { options: undefined }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const undefinedHost: any = { options: { host: undefined } }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const definedHost: any = { options: { host: 'localhost' } }

  test.skip('getHost with undefined pool', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getHost(undefinedPool)).toBeUndefined()
  })

  test.skip('getHost with undefined host', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getHost(undefinedHost)).toBeUndefined()
  })

  test('getHost with defined host', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getHost(definedHost)).toBe('localhost')
  })
})

describe('tests getPort', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const undefinedPool: any = { options: undefined }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const undefinedPort: any = { options: { port: undefined } }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const definedPort: any = { options: { port: 5432 } }

  test.skip('getPort with undefined pool', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getPort(undefinedPool)).toBeUndefined()
  })

  test.skip('getPort with undefined port', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getPort(undefinedPort)).toBeUndefined()
  })

  test('getPort with defined port', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getPort(definedPort)).toBe(5432)
  })
})

describe('tests getDatabase', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const undefinedPool: any = { options: undefined }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const undefinedDatabase: any = { options: { database: undefined } }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const definedDatabase: any = { options: { database: 'database' } }

  test.skip('getDatabase with undefined pool', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getDatabase(undefinedPool)).toBeUndefined()
  })

  test('getDatabase with undefined database', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getDatabase(undefinedDatabase)).toBeUndefined()
  })

  test('getDatabase with defined database', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getDatabase(definedDatabase)).toBe('database')
  })
})
