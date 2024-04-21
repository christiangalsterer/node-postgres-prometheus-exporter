[![GitHub Actions CI Status](https://github.com/christiangalsterer/node-postgres-prometheus-exporter/actions/workflows/build.yaml/badge.svg)](https://github.com/christiangalsterer/node-postgres-prometheus-exporter/actions/workflows/build.yaml)
[![codecov](https://codecov.io/gh/christiangalsterer/node-postgres-prometheus-exporter/graph/badge.svg?token=2KFRFMXSGS)](https://codecov.io/gh/christiangalsterer/node-postgres-prometheus-exporter)
[![Coverage Status](https://coveralls.io/repos/github/christiangalsterer/node-postgres-prometheus-exporter/badge.svg?branch=main)](https://coveralls.io/github/christiangalsterer/node-postgres-prometheus-exporter?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/christiangalsterer/node-postgres-prometheus-exporter/badge.svg)](https://github.com/christiangalsterer/node-postgres-prometheus-exporter/security/advisories)
[![npm downloads](https://img.shields.io/npm/dt/@christiangalsterer/node-postgres-prometheus-exporter.svg)](https://www.npmjs.com/package/@christiangalsterer/node-postgres-prometheus-exporter)
[![npm version](https://img.shields.io/npm/v/@christiangalsterer/node-postgres-prometheus-exporter.svg)](https://www.npmjs.com/package/@christiangalsterer/node-postgres-prometheus-exporter?activeTab=versions)
[![npm license](https://img.shields.io/npm/l/@christiangalsterer/node-postgres-prometheus-exporter.svg)](https://www.npmjs.com/package/@christiangalsterer/node-postgres-prometheus-exporter)
[![semver](https://img.shields.io/badge/semver-2.0.0-green)](https://semver.org)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://developer.mend.io/github/christiangalsterer/node-postgres-prometheus-exporter)
![github stars](https://img.shields.io/github/stars/christiangalsterer/node-postgres-prometheus-exporter.svg)

# Prometheus Exporter for node-postgres

A prometheus exporter exposing metrics for [node-postgres](https://node-postgres.com/).

## Available Metrics

The exporter provides the following metrics.

### pg.Client Metrics

|Metric Name|Description|Labels|Since|
|---|---|---|---|
|pg_client_errors_total|The total number of connection errors with a database|<ul><li>_host_: The host of the database.</li><li>_database_: The database name</li><ul>|1.0.0|
|pg_client_disconnects_total|The total number of disconnected connections|<ul><li>_host_: The host of the database.</li><li>_database_: The database name</li><ul>|1.0.0|

### pg.Pool Metrics

|Metric Name|Description|Labels|Since|
|---|---|---|---|
|pg_pool_connections_created_total|The total number of created connections|<ul><li>_host_: The host of the database.</li><li>_database_: The database name</li><ul>|1.0.0|
|pg_pool_size|The current size of the connection pool, including active and idle members|<ul><li>_host_: The host of the database.</li><li>_database_: The database name</li><ul>|1.0.0|
|pg_pool_active_connections|The total number of active connections|<ul><li>_host_: The host of the database.</li><li>_database_: The database name</li><ul>|1.0.0|
|pg_pool_errors_total|The total number of connection errors with a database|<ul><li>_host_: The host of the database.</li><li>_database_: The database name</li><ul>|1.0.0|
|pg_pool_connections_removed_total|The total number of removed connections|<ul><li>_host_: The host of the database.</li><li>_database_: The database name</li><ul>|1.0.0|

## Example Output

Here an example output in the prometheus format of the provided metrics.

```sh
# HELP pg_client_errors_total The total number of connection errors with a database.
# TYPE pg_client_errors_total counter
pg_client_errors_total{host="localhost:5432",database="node_postgres_test1"} 1

# HELP pg_client_disconnects_total The total number of disconnected connections.
# TYPE pg_client_disconnects_total counter
pg_client_disconnects_total{host="localhost:5432",database="node_postgres_test1"} 1

# HELP pg_pool_connections_created_total The total number of created connections.
# TYPE pg_pool_connections_created_total counter
pg_pool_connections_created_total{host="localhost:5432",database="node_postgres_test1"} 19

# HELP pg_pool_size The current size of the connection pool, including active and idle members.
# TYPE pg_pool_size gauge
pg_pool_size{host="localhost:5432",database="node_postgres_test1"} 10

# HELP pg_pool_max The maximum size of the connection pool.
# TYPE pg_pool_max gauge
pg_pool_max{host="localhost:5432",database="node_postgres_test1"} 10

# HELP pg_pool_active_connections The total number of active connections.
# TYPE pg_pool_active_connections gauge
pg_pool_active_connections{host="localhost:5432",database="node_postgres_test1"} 10

# HELP pg_pool_waiting_connections The total number of waiting connections.
# TYPE pg_pool_waiting_connections gauge
pg_pool_waiting_connections{host="localhost:5432",database="node_postgres_test1"} 1

# HELP pg_pool_idle_connections The total number of idle connections.
# TYPE pg_pool_idle_connections gauge
pg_pool_idle_connections{host="localhost:5432",database="node_postgres_test1"} 0

# HELP pg_pool_errors_total The total number of connection errors with a database.
# TYPE pg_pool_errors_total counter
pg_pool_errors_total{host="localhost:5432",database="node_postgres_test1"} 1

# HELP pg_pool_connections_removed_total The total number of removed connections.
# TYPE pg_pool_connections_removed_total counter
pg_pool_connections_removed_total{host="localhost:5432",database="node_postgres_test1"} 9
```

# Usage

## Add Dependency

Add the following dependency to your project to download the package from [npm](https://www.npmjs.com/package/@christiangalsterer/node-postgres-prometheus-exporter).

```sh
npm i @christiangalsterer/node-postgres-prometheus-exporter
```

## TypeScript

The following example illustrates how to use the exporter to enable monitoring for the node-postgres.

```ts
import { Client, Pool } from 'pg'
import { Registry, collectDefaultMetrics } from 'prom-client'
import { monitorPgClient, monitorPgPool } from '@christiangalsterer/node-postgres-prometheus-exporter'

...

// set up a pg.Client
const client = new Client()

// set up a pg.Pool
const pool = new Pool()

// set up the prometheus client
const register = new Registry();
collectDefaultMetrics({ register })

// monitor the pg.Client
monitorPgClient(client, register)

// monitor the pg.Pool
monitorPgPool(pool, register)

...

// connect to PostgreSQL *after* calling monitorPgClient() / monitorPgPool()
await client.connect()
await pool.connect()
```

## JavaScript

The following example illustrates how to use the exporter to enable monitoring for node-postgres.

```js
const pg = require('pg')
const promClient = require( 'prom-client');
const postgresExporter = require('@christiangalsterer/node-postgres-prometheus-exporter')

// set up a pg.Client
const client = new pg.Client()

// set up a pg.Pool
const pool = new pg.Pool()

// set up the prometheus client
const collectDefaultMetrics = promClient.collectDefaultMetrics;
const Registry = promClient.Registry;
const register = new Registry();
collectDefaultMetrics({ register });

// monitor the pg.Client
postgresExporter.monitorPgClient(client, register)

// monitor the pg.Pool
postgresExporter.monitorPgPool(pool, register)

// connect to Postgres *after* calling monitorPgClient() / monitorPgPool()
await client.connect()
await pool.connect()
```

# Configuration

The exporter can be configured via properties specified on the optional parameter of type
_PgClientExporterOptions_  and _PgPoolExporterOptions_ respectively.

## PgClientExporterOptions

|property|Description|Example|Since |
|---|---|---|---|
| defaultLabels | Default labels added to each metrics. | {'foo':'bar', 'alice': 3} | 1.0.0 |

## PgPoolExporterOptions

|property|Description|Example|Since |
|---|---|---|---|
| defaultLabels | Default labels added to each metrics. | {'foo':'bar', 'alice': 3} | 1.0.0|

# Grafana Dashboard

An example dashboard for Grafana is available [here](/docs/grafana/dashboard.json) displaying the provided metrics by the exporter.

Here an example for node-postgres client metrics:
![Grafana:node-postgres Client Metrics](/docs/images/grafana_node_postgres_client_1.png "Grafana: node-postgres Client Metrics")

Here an example for node-postgres pool metrics:
![Grafana:node-postgres Pool Metrics](/docs/images/grafana_node_postgres_pool_1.png "Grafana: node-postgres Pool Metrics")

# Changelog

The changes to project can be found in the [changelog](/CHANGELOG.md).

# Compatibility

The following table list the compatibility of exporter versions with different node-postgres and prom-client versions.

|Exporter Version|node-postgres Version|prom-client version|
|---|---|---|
|^1.0.0|^8.11.0|^15.0.0|

# Contributions

Contributions are highly welcome. If you want to contribute to this project please follow the steps described in the [contribution guidelines](/CONTRIBUTING.md).

# Projects Using The Exporter

If you want to support this project, please add a link to your project and/or company when you use this exporter.

# Related Projects

If you are looking for a way to monitor your MongoDB Driver for Node.js you may have a look at <https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter>.

If you are looking for a way to monitor KafkaJs for Node.js you may have a look at <https://github.com/christiangalsterer/kafkajs-prometheus-exporter>.
