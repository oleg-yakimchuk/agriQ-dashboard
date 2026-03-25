## agriQ System Architecture (Task 1)
Below is the High-Level Architecture (HLA) detailing the data ingestion, microservices routing, and storage pipeline for the 120 sensor balls.

*For a detailed explanation of the pipeline, decoupled message queuing, and database structure, please see `design.md`.*

```mermaid
graph TD
    classDef hardware fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px,color:black,rx:5,ry:5;
    classDef aws fill:#FFF3E0,stroke:#EF6C00,stroke-width:2px,color:black,rx:5,ry:5;
    classDef compute fill:#FFFDE7,stroke:#FBC02D,stroke-width:2px,color:black,rx:5,ry:5;
    classDef database fill:#E1F5FE,stroke:#0277BD,stroke-width:2px,color:black,stroke-dasharray: 5 5;
    classDef error fill:#FFEBEE,stroke:#C62828,stroke-width:2px,color:black,stroke-dasharray: 5 5;
    classDef client fill:#E3F2FD,stroke:#1565C0,stroke-width:2px,color:black,rx:10,ry:10;

    subgraph Edge ["1. Edge Ingestion Layer"]
        S["120 Sensor Arrays"]:::hardware --> GW["Local Cell Gateway"]:::hardware
        GW -- "MQTT" --> IOT["AWS IoT Core"]:::aws
        IOT --> SNS_Ingest["SNS: Ingestion Topic"]:::aws
    end

    subgraph External ["2. External Providers"]
        EB["EventBridge (Cron)"]:::aws --> L_Provider["Lambda: Provider Service"]:::compute
        W_API["Weather API"]:::hardware -.-> L_Provider
        C_API["CBOT API"]:::hardware -.-> L_Provider
        L_Provider --> SNS_Ingest
    end

    subgraph Dispatch ["3. Central Dispatcher (The Brain)"]
        SNS_Ingest --> SQS_Ingest["SQS: Intake Buffer"]:::aws
        SQS_Ingest --> L_Analyzer["Lambda: Analyzer & Dispatcher"]:::compute
        L_Analyzer -- "Evaluates Logic" --> SNS_Route["SNS: Telemetry Router"]:::aws
    end

    subgraph Microservices ["4. Decoupled Action Microservices"]
        SNS_Route -- "Tag: Normal" --> SQS_N["SQS: Normal Queue"]:::aws
        SNS_Route -- "Tag: Warning" --> SQS_W["SQS: Warning Queue"]:::aws
        SNS_Route -- "Tag: Critical" --> SQS_C["SQS: Critical Queue"]:::aws

        SQS_N --> L_Red["Lambda: Reducer Service"]:::compute
        SQS_W --> L_Store["Lambda: Storage Service"]:::compute
        SQS_C --> L_Alert["Lambda: Alert Manager"]:::compute

    %% Fault Tolerance
        SQS_N -.-> DLQ["Dead Letter Queue (DLQ)"]:::error
        SQS_W -.-> DLQ
        SQS_C -.-> DLQ
    end

    subgraph Persistence ["5. Persistence & Notification"]
        L_Red  --> TSDB[("Amazon Timestream (TSDB)")]:::database
        L_Store -- "Warning Snapshot" --> TSDB
        L_Alert -- "Critical Event Record" --> TSDB

        L_Store -- "Update Status" --> RDS[("Amazon RDS")]:::database
        L_Alert -- "Update Status" --> RDS

        L_Alert --> SNS_Notify["SNS: Notification Topic"]:::aws
        SNS_Notify --> SMS["Operator Phone (SMS/Push)"]:::hardware
    end

    subgraph ClientLayer ["6. Application Layer (Task 2)"]
        TSDB --> API["Express.js REST API"]:::client
        RDS --> API
        API -- "JSON Payload" --> UI["React Operator Dashboard"]:::client
    end
```    
---

## Operator Dashboard & API (Task 2)
This repository contains the interactive frontend dashboard and the supporting backend API built to visualize the telemetry data and active alerts described in the architecture above.

### Core Features
* **Global Sites Overview:** High-level status cards displaying aggregated telemetry and system health for all 4 grain piles (clickable).
* **Hardware Drill-down Map:** Interactive modal mapping the 30-sensor arrays within individual piles to locate localized heat/moisture anomalies across Bottom, Middle, and Top layers.
* **Active Alerts Center:** An aggregated data table filtering all out-of-bounds and erratic sensors across the facility into a single actionable list for the operator.

### Technology Stack
* **Frontend Framework:** React 18 + TypeScript
* **Backend API:** Node.js + Express.js
* **Build Tool:** Vite (for fast HMR and optimized builds)
* **Styling:** Tailwind CSS (Pure utility-first approach for speed and stability)
* **Routing:** React Router DOM

### Local Development Setup

#### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine. To run this project locally, you will need two separate terminal windows.

#### 1. Start the Backend API
Open your first terminal, navigate to the `server` directory, install dependencies, and start the server:
```bash
cd server
npm install
npm run dev
```

You can see the mock data by going to `http://localhost:5001/api/piles`

#### 2. Start the Frontend Dashboard
Open a second terminal, navigate to the `dashboard` directory, install dependencies, and launch the development server:
```bash
cd dashboard
npm install
npm run dev
```

Open your browser and navigate to the local URL provided in the terminal (usually `http://localhost:5173`).