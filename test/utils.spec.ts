import { describe, expect, test } from '@jest/globals'
import { mergeLabelNamesWithStandardLabels, mergeLabelsWithStandardLabels, getMaxPoolSize } from '../src/utils'

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
