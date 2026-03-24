# AgriQ Backend Architecture & Design Document

## 1. System Overview
This architecture supports the Harish 7 facility, monitoring 4 wheat piles within a 50m x 25m x 10m storage cell. The system ingests telemetry from 120 wireless sensor balls (30 per pile distributed across bottom, middle, and top layers), alongside gateway ambient sensors, Emek Hefer weather data, and CBOT commodity prices. Readings are processed every 12 hours to assess spoilage and combustion risks.

## 2. Data Ingestion Pipeline
To ensure high availability and prevent data loss from hardware disconnects, the ingestion pipeline relies on an event-driven, decoupled cloud architecture.

* **Hardware-to-Cloud (Telemetry):** The wireless sensor balls transmit their temperature and moisture readings to the local cell gateway using a low-power protocol (e.g., LoRaWAN or BLE). The gateway aggregates this data, appends its own ambient temperature and humidity readings, and publishes a consolidated JSON payload to AWS IoT Core via secure MQTT.
* **Message Decoupling:** AWS IoT Core rules route incoming payloads to an Amazon SQS (Simple Queue Service) queue. This acts as a buffer; if the database or processing layer experiences downtime, sensor data is retained in the queue rather than lost.
* **Processing & Normalization:** An AWS Lambda function (Node.js or Python) consumes messages from the SQS queue. It sanitizes the data, validates sensor IDs, and routes the telemetry to the database.
* **External Data (APIs):** A separate Lambda function, triggered every 12 hours by Amazon EventBridge, makes outbound REST calls to fetch Emek Hefer weather data and CBOT commodity prices.
* **Additional Data Source - Aeration Fan Status:** The system will also ingest the operational status (ON/OFF) of the facility's aeration fans. *Justification:* When analyzing temperature trends, knowing whether active cooling is already running is critical context for the risk logic engine to determine if an alert should be escalated or observed.

## 3. Database Structure
A hybrid database approach is necessary to handle both high-volume time-series telemetry and relational entity mapping.

### A. Time-Series Database (TSDB)
We will use a time-series optimized database (like PostgreSQL with the TimescaleDB extension or Amazon Timestream) to store immutable, timestamped readings. This allows for highly efficient querying of historical trends and rollups.

* `sensor_readings`: timestamp (Hypertable/Partition Key), sensor_id, temperature_c, moisture_pct.
* `gateway_readings`: timestamp, gateway_id, ambient_temp_c, ambient_humidity_pct.
* `external_metrics`: timestamp, weather_temp, weather_humidity, cbot_wheat_price.

### B. Relational Database (RDBMS)
A standard relational schema (e.g., PostgreSQL) will manage the facility's structural metadata and stateful alerts.

* `Facilities`: id, name, address, dimensions.
* `Piles`: id, facility_id, name, commodity_type, current_status (OK, Warning, Critical).
* `Sensors`: id, pile_id, layer (Bottom, Middle, Top), installation_date.
* `Alerts`: id, pile_id, triggered_at, resolved_at, status_level, affected_sensors (JSON array), operator_action_required.