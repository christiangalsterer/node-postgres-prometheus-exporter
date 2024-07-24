import type { Pool } from 'pg'

/**
 * Merges an array of label names with the label names of the default labels into a new array.
 * @param labelNames array of label names to merge with the default labels
 * @param defaultLabels default labels to merge with
 * @returns array of merged label names
 */
export function mergeLabelNamesWithStandardLabels(labelNames: string[], defaultLabels?: Record<string, string | number>): string[] {
  let merged: string[]
  defaultLabels !== undefined ? (merged = labelNames.concat(Object.keys(defaultLabels))) : (merged = labelNames)
  return merged
}

/**
 * Merges Labels with default labels
 * @param labels labels to merge with the default labels
 * @param defaultLabels default labels to merge with
 * @returns merged labels
 */
export function mergeLabelsWithStandardLabels(
  labels: Record<string, string | number | undefined>,
  defaultLabels?: Record<string, string | number>
): Record<string, string | number> {
  let merged: Record<string, string | number>
  const filtered = Object.fromEntries(
    Object.entries(labels)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => [key, value!])
  ) as Record<string, string | number>
  defaultLabels !== undefined ? (merged = { ...filtered, ...defaultLabels }) : (merged = filtered)
  return merged
}

/**
 * Tries to determine the max pool size from the pool via direct property access as the configuration is not exported
 * @param pool the pool from which to get the property
 * @returns the configured max pool size or undefined
 */
export function getMaxPoolSize(pool: Pool): number | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
  return (pool as any).options?.max
}

/**
 * Tries to determine the host configuration from the pool via direct property access as the configuration is not exported
 * @param pool the pool from which to get the property
 * @returns the configured host or undefined
 */
export function getHost(pool: Pool): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
  return (pool as any).options?.host
}

/**
 * Tries to determine the port configuration from the pool via direct property access as the configuration is not exported
 * @param pool the pool from which to get the property
 * @returns the configured port or undefined
 */
export function getPort(pool: Pool): number {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
  return (pool as any).options?.port
}

/**
 * Tries to determine the database configuration from the pool via direct property access as the configuration is not exported
 * @param pool the pool from which to get the property
 * @returns the configured database or undefined
 */
export function getDatabase(pool: Pool): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
  return (pool as any).options?.database
}
