/**
 * Optional parameter to configure the exporter.
 */
export interface PgExporterOptions {

  /**
   * Default labels for all metrics, e.g. {'foo':'bar', alice: 3}
   */
  defaultLabels?: Record<string, string | number>
}
