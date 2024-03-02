import { describe, expect, test } from '@jest/globals'
import { getDatabase, getHost, getMaxPoolSize, getPort, mergeLabelNamesWithStandardLabels, mergeLabelsWithStandardLabels } from '../src/utils'

describe('tests mergeLabelNamesWithStandardLabels', () => {
  const defaultLabels = { foo: 'bar', alice: 3 }
  const labels = ['label1', 'label2']
  const emptylabels = []

  test('test mergeLabelNamesWithStandardLabels with no default labels', () => {
    expect(mergeLabelNamesWithStandardLabels(labels)).toStrictEqual(labels)
  })

  test('test mergeLabelNamesWithStandardLabels with empty labels and no default labels', () => {
    expect(mergeLabelNamesWithStandardLabels(emptylabels)).toStrictEqual([])
  })

  test('test mergeLabelNamesWithStandardLabels with default labels', () => {
    expect(mergeLabelNamesWithStandardLabels(labels, defaultLabels)).toStrictEqual(['label1', 'label2', 'foo', 'alice'])
  })

  test('test mergeLabelNamesWithStandardLabels with empty labels and default labels', () => {
    expect(mergeLabelNamesWithStandardLabels(emptylabels, defaultLabels)).toStrictEqual(['foo', 'alice'])
  })
})

describe('tests mergeLabelsWithStandardLabels', () => {
  const defaultLabels = { foo: 'bar', alice: 3 }
  const labels = { label1: 'value1', label2: 2, label3: undefined }
  const emptyLabels = {}

  test('test mergeLabelsWithStandardLabels with labels and no default labels', () => {
    expect(mergeLabelsWithStandardLabels(labels)).toStrictEqual({ label1: 'value1', label2: 2 })
  })

  test('test mergeLabelsWithStandardLabels with empty labels and no default labels', () => {
    expect(mergeLabelsWithStandardLabels(emptyLabels)).toStrictEqual(emptyLabels)
  })

  test('test mergeLabelsWithStandardLabels with labels and default labels', () => {
    expect(mergeLabelsWithStandardLabels(labels, defaultLabels)).toStrictEqual({ label1: 'value1', label2: 2, foo: 'bar', alice: 3 })
  })

  test('test mergeLabelsWithStandardLabels with empty labels and default labels', () => {
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

  test('test getMaxPoolSize with undefined pool', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getMaxPoolSize(undefinedPool)).toStrictEqual(undefined)
  })

  test('test getMaxPoolSize with undefined max', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getMaxPoolSize(undefinedMax)).toStrictEqual(undefined)
  })

  test('test getMaxPoolSize with defined max', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getMaxPoolSize(definedMax)).toStrictEqual(5)
  })
})

describe('tests getHost', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const undefinedPool: any = { options: undefined }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const undefinedHost: any = { options: { host: undefined } }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const definedHost: any = { options: { host: 'localhost' } }

  test('test getHost with undefined pool', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getHost(undefinedPool)).toStrictEqual(undefined)
  })

  test('test getHost with undefined host', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getHost(undefinedHost)).toStrictEqual(undefined)
  })

  test('test getHost with defined host', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getHost(definedHost)).toStrictEqual('localhost')
  })
})

describe('tests getPort', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const undefinedPool: any = { options: undefined }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const undefinedPort: any = { options: { port: undefined } }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const definedPort: any = { options: { port: 5432 } }

  test('test getPort with undefined pool', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getPort(undefinedPool)).toStrictEqual(undefined)
  })

  test('test getPort with undefined port', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getPort(undefinedPort)).toStrictEqual(undefined)
  })

  test('test getPort with defined port', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getPort(definedPort)).toStrictEqual(5432)
  })
})

describe('tests getDatabase', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const undefinedPool: any = { options: undefined }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const undefinedDatabase: any = { options: { database: undefined } }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const definedDatabase: any = { options: { database: 'database' } }

  test('test getDatabase with undefined pool', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getDatabase(undefinedPool)).toStrictEqual(undefined)
  })

  test('test getDatabase with undefined database', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getDatabase(undefinedDatabase)).toStrictEqual(undefined)
  })

  test('test getDatabase with defined database', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(getDatabase(definedDatabase)).toStrictEqual('database')
  })
})
