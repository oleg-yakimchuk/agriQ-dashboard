# AgriQ Backend Architecture & Design Document

## 1. System Overview
This architecture supports the Harish 7 facility, monitoring 4 wheat piles within a 50m x 25m x 10m storage cell. The system ingests telemetry from 120 wireless sensor balls alongside external weather and commodity APIs. The system utilizes a decoupled, event-driven microservices architecture with dedicated stream processing to optimize storage and process critical alerts.

## 2. Microservices & Ingestion Pipeline

### A. Data Provisioning
* **Edge Telemetry:** Sensors transmit via local gateway to AWS IoT Core using MQTT. Payloads are forwarded to an initial SNS Ingestion Topic.
* **External Providers:** A dedicated Lambda Provider Service fetches Emek Hefer weather and CBOT prices, normalizing the data before pushing it to the SNS Ingestion Topic.

### B. The Analyzer & Dispatcher
* An **Analyzer Service** (Node.js Lambda) consumes the unified ingestion stream via an SQS Intake Buffer.
* It evaluates telemetry against safety thresholds and publishes the payload to an SNS Telemetry Router, utilizing SNS Message Attributes to tag the data as `Normal`, `Warning`, or `Critical`.

### C. Action Microservices (The Fanout)
Dedicated SQS queues subscribe to the SNS Router based on their specific tags, triggering single-responsibility Node.js Lambda microservices:
1. **Reducer Service (Normal Data):** Consumes nominal telemetry. Calculates 12-hour rolling averages to reduce TSDB write volume.
2. **Storage Service (Warning Data):** Consumes anomalous telemetry. Formats and persists detailed anomaly snapshots to the TSDB and updates the pile status in the RDBMS.
3. **Alert Manager (Critical Data):** Consumes out-of-bounds telemetry on a dedicated fast-lane queue. Formats high-priority event records, updates the RDBMS, and publishes to an SNS Notification Topic to trigger SMS/Push alerts to the facility operator.

*Fault Tolerance:* All SQS queues are paired with Dead Letter Queues (DLQs) to retain failed payloads for debugging without blocking the primary pipelines.

## 3. Database Architecture

### A. Time-Series Database (TSDB)
**Amazon Timestream** handles high-velocity, append-only workloads for both the 12-hour averaged data and the raw anomaly bursts.
* `sensor_metrics`: timestamp, sensor_id, temperature_c, moisture_pct, status_flag.
* `external_metrics`: timestamp, weather_temp, weather_humidity, cbot_wheat_price.

### B. Relational Database (RDBMS)
**Amazon RDS** manages the facility's structural metadata and stateful alerts.
* `Facilities`: id, name, dimensions.
* `Piles`: id, facility_id, name, current_status (OK, Warning, Critical).
* `Sensors`: id, pile_id, layer (Bottom, Middle, Top).
* `Alerts`: id, pile_id, triggered_at, status_level, operator_action_required.