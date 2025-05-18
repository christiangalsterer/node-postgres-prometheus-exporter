import type { Pool } from 'pg'

/**
 * Merges an array of label names with the label names of the default labels into a new array.
 * @param labelNames array of label names to merge with the default labels
 * @param defaultLabels default labels to merge with
 * @returns array of merged label names
 */
export function mergeLabelNamesWithStandardLabels(labelNames: string[], defaultLabels = {}): string[] {
  return labelNames.concat(Object.keys(defaultLabels))
}

/**
 * Merges Labels with default labels
 * @param labels labels to merge with the default labels
 * @param defaultLabels default labels to merge with
 * @returns merged labels
 */
export function mergeLabelsWithStandardLabels(
  labels: Record<string, string | number | undefined>,
  defaultLabels = {}
): Record<string, string | number> {
  const filtered = Object.fromEntries(
    Object.entries(labels)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => [key, value!])
  ) as Record<string, string | number>
  return { ...filtered, ...defaultLabels }
}

/**
 * Tries to determine the max pool size from the pool via direct property access as the configuration is not exported
 * @param pool the pool from which to get the property
 * @returns the configured max pool size or undefined
 */
export function getMaxPoolSize(pool: Pool): number | undefined {
  return pool.options.max
}

/**
 * Tries to determine the host configuration from the pool via direct property access as the configuration is not exported
 * @param pool the pool from which to get the property
 * @returns the configured host or undefined
 */
export function getHost(pool: Pool): string | undefined {
  return pool.options.host ?? undefined
}

/**
 * Tries to determine the port configuration from the pool via direct property access as the configuration is not exported
 * @param pool the pool from which to get the property
 * @returns the configured port or 5432 if not set
 * @see https://node-postgres.com/api/pool#pool-connection-parameters
 */
export function getPort(pool: Pool): number {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  return pool.options.port ?? 5432
}

/**
 * Tries to determine the database configuration from the pool via direct property access as the configuration is not exported
 * @param pool the pool from which to get the property
 * @returns the configured database or undefined
 */
export function getDatabase(pool: Pool): string | undefined {
  return pool.options.database
}
