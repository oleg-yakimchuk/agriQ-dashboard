# AgriQ Backend Architecture & Design Document

## 1. System Overview
This architecture supports the Harish 7 facility, monitoring 4 wheat piles within a 50m x 25m x 10m storage cell. The system ingests telemetry from 120 wireless sensor balls (30 per pile distributed across bottom, middle, and top layers), alongside gateway ambient sensors, Emek Hefer weather data, and CBOT commodity prices. Readings are processed every 12 hours to assess spoilage and combustion risks.

## 2. Data Ingestion Pipeline
To ensure high availability, flexibility, and independent scaling, the ingestion pipeline relies on an event-driven microservices architecture using the SNS-to-SQS "Fanout" pattern.

* **Hardware-to-Cloud (Telemetry):** The wireless sensor balls transmit their temperature and moisture readings to the local cell gateway using a low-power protocol (e.g., LoRaWAN or BLE). The gateway aggregates this data, appends its own ambient temperature and humidity readings, and publishes a consolidated JSON payload to AWS IoT Core via secure MQTT.
* **Message Routing (Fanout):** AWS IoT Core rules route incoming payloads to an Amazon SNS (Simple Notification Service) topic. SNS then "fans out" the message by simultaneously publishing it to multiple independent Amazon SQS (Simple Queue Service) queues.
* **Microservices Processing:** Dedicated AWS Lambda functions running in a Node.js environment consume messages from their respective SQS queues:
    * *Storage Service:* Consumes from a Storage SQS queue to sanitize data and write it to the time-series database.
    * *Alerting Service:* Consumes from an Alert SQS queue to evaluate risks without impacting the storage pipeline.
* **External Data (APIs):** A separate AWS Lambda function running in a Node.js environment, triggered every 12 hours by Amazon EventBridge, makes outbound REST calls to fetch Emek Hefer weather data and CBOT commodity prices.
* **Additional Data Source - Aeration Fan Status:** The system will also ingest the operational status (ON/OFF) of the facility's aeration fans. *Justification:* When analyzing temperature trends, knowing whether active cooling is already running is critical context for the risk logic engine to determine if an alert should be escalated or observed.

## 3. Database Structure
The architecture utilizes specific databases to handle both high-volume time-series telemetry and relational entity mapping.

### A. Time-Series Database (TSDB)
We will use a time-series optimized database like TimescaleDB or Amazon Timestream to store immutable, timestamped readings. This allows for highly efficient querying of historical trends and rollups.

* `sensor_readings`: timestamp (Hypertable/Partition Key), sensor_id, temperature_c, moisture_pct.
* `gateway_readings`: timestamp, gateway_id, ambient_temp_c, ambient_humidity_pct.
* `external_metrics`: timestamp, weather_temp, weather_humidity, cbot_wheat_price.

### B. Relational Database (RDBMS)
Amazon RDS will manage the facility's structural metadata and stateful alerts.

* `Facilities`: id, name, address, dimensions.
* `Piles`: id, facility_id, name, commodity_type, current_status (OK, Warning, Critical).
* `Sensors`: id, pile_id, layer (Bottom, Middle, Top), installation_date.
* `Alerts`: id, pile_id, triggered_at, resolved_at, status_level, affected_sensors (JSON array), operator_action_required.