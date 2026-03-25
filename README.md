## agriQ System Architecture (Task 1)
Below is the High-Level Architecture (HLA) detailing the data ingestion, microservices routing, and storage pipeline for the 120 sensor balls.

*For a detailed explanation of the pipeline, decoupled message queuing, and database structure, please see `design.md`.*

```mermaid
graph LR
%% Setting up the main layout and colors
    classDef hardware fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px,color:black,rx:5,ry:5;
    classDef aws fill:#FFF3E0,stroke:#EF6C00,stroke-width:2px,color:black,rx:5,ry:5;
    classDef compute fill:#FFFDE7,stroke:#FBC02D,stroke-width:2px,color:black,rx:5,ry:5;
    classDef database fill:#E1F5FE,stroke:#0277BD,stroke-width:2px,color:black,stroke-dasharray: 5 5;
    classDef client fill:#E3F2FD,stroke:#1565C0,stroke-width:2px,color:black,rx:10,ry:10;

    subgraph Facilities ["Harish 7 Facility (Hardware)"]
        Sensors["30-Sensor Balls / Pile"]:::hardware --> GW["Local Cell Gateway"]:::hardware
        GW -- "MQTT (Telemetry)" --> IOT["AWS IoT Core"]:::aws
    end

    subgraph Router ["Decoupled Message Routing (Ingestion)"]
        IOT --> SNS["Amazon SNS: Telemetry Router"]:::aws
    end

    subgraph Services ["Event-Driven Microservices"]
        SNS -- "FANOUT (Subscribe)" --> SQS1["SQS: Storage Buffer"]:::aws
        SNS -- "FANOUT (Subscribe)" --> SQS2["SQS: Alert Buffer"]:::aws

        SQS1 --> L1["Lambda Node.js: Data Writer"]:::compute
        SQS2 --> L3["Lambda Node.js: Risk Engine"]:::compute

        L1 --> TSDB[("TimescaleDB: Telemetry")]:::database
        L3 --> RDS[("Amazon RDS: Metadata")]:::database

        EB["EventBridge Trigger"]:::aws --> L2["Lambda Node.js: External APIs"]:::compute
        WeatherAPI["Hefer Weather API"]:::hardware -.-> L2
        CmdtyAPI["CBOT Wheat API"]:::hardware -.-> L2
        L2 --> TSDB
    end

    subgraph Clients ["Full-Stack Application Layer (Task 2)"]
        TSDB --> REST_API["Express.js REST API"]:::client
        RDS --> REST_API
        REST_API --> UI["React Operator Dashboard"]:::client
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