# 🏭 AI-Powered Worker Productivity Dashboard

A production-ready, scalable full-stack application that ingests AI-generated CCTV events, computes productivity metrics, and visualizes them through an interactive dashboard.

Built using **Next.js 14, Node.js (Express), MongoDB, and Docker**.

---

## 🚀 Live Application

- 🌐 **Live Demo: https://ai-worker-productivity-dashboard-5i.vercel.app

---

## 🏗 Architecture Overview

### Edge → Backend → Dashboard Flow


CCTV Cameras (Edge AI)
│
│ AI Event (HTTP POST)
▼
Express.js Backend (Node.js)
│
│ Aggregation + Business Logic
▼
MongoDB Database
│
│ REST API
▼
Next.js 14 Dashboard


### Components

- **Edge Layer:** AI cameras generate structured worker activity events.
- **Backend:** Validates, deduplicates, aggregates, and computes metrics.
- **Database:** Stores workers, workstations, and events with indexing.
- **Frontend:** Displays real-time factory analytics.
- **Infrastructure:** Docker Compose orchestrates all services.

---

## 🗄 Database Schema

### Workers
- `worker_id` (unique)
- `name`
- `timestamps`

### Workstations
- `station_id` (unique)
- `name`
- `type`

### AIEvents
- `timestamp`
- `worker_id`
- `workstation_id`
- `event_type` (working | idle | absent | product_count)
- `confidence`
- `count` (optional)
- `event_hash` (unique)
- `model_version` (optional)

### Indexes
- Unique: `event_hash`
- `timestamp`
- `(worker_id, timestamp)`
- `(workstation_id, timestamp)`

---

## 📊 Metric Definitions

### Worker-Level
- **Active Hours** = Duration in "working"
- **Idle Hours** = Duration in "idle"
- **Utilization %** = Active / (Active + Idle) × 100
- **Total Units Produced** = Σ product_count
- **Units per Hour** = Units / Active Hours

### Workstation-Level
- **Occupancy Time** = Working + Idle
- **Utilization %**
- **Throughput Rate** = Units / Occupancy

### Factory-Level
- Total Productive Hours
- Total Production Count
- Average Utilization
- Average Production Rate

---

## ⚙ Assumptions & Tradeoffs

- Events sorted before time-difference calculation
- Gaps > 8 hours ignored (shift boundary)
- Confidence threshold ≥ 0.7
- No extrapolation for missing closing events
- Dynamic aggregation (can optimize with rollups later)

**Tradeoff:**  
Real-time aggregation prioritizes simplicity over pre-computed summaries.

---

## 🛡 Handling Edge Cases

### 1️⃣ Intermittent Connectivity
- Batch ingestion endpoint
- Idempotent API
- Delayed events accepted
- Sorting before computation

### 2️⃣ Duplicate Events

hash = SHA256(timestamp + worker_id + workstation_id + event_type)

- Unique DB index prevents duplicates
- Returns conflict on repeat submission

### 3️⃣ Out-of-Order Timestamps
- Aggregation pipeline sorts events
- Time differences calculated post-sort
- Ensures accurate duration metrics

---

## 🤖 Model Improvements (MLOps)

### Model Versioning

Add:

model_version: "v2.1"


Enables:
- A/B testing
- Rollbacks
- Version performance comparison

### Drift Detection

Monitor:
- Average confidence
- Event distribution changes
- Rejection rate spikes

Trigger alert if confidence drops below threshold for consecutive days.

### Retraining Trigger

Drift detected → Export low-confidence events → Retrain → Canary Deploy → Full Rollout

---

## 📈 Scalability Strategy

### 5 Cameras
- Single backend
- Single MongoDB
- ~5 events/sec

### 100+ Cameras
- Horizontal backend scaling
- Load balancer
- Kafka for event buffering
- Redis caching
- MongoDB indexing + sharding

### Multi-Site
- Add `factory_id`
- Regional clusters
- Central analytics DB
- Multi-tenant architecture

---

## 📦 Deployment

Run locally:


docker-compose up --build


- Frontend: http://localhost:3000  
- Backend: http://localhost:5000  

---

## 🎯 Theoretical Questions (Required)

### How do you handle intermittent connectivity?
Batch ingestion, idempotent writes, timestamp-based sorting before aggregation.

### How do you prevent duplicate events?
SHA-256 event hash + unique DB index.

### How do you handle out-of-order timestamps?
Events sorted before duration calculation.

### How does the system scale?
Load balancing, message queues, caching, sharding, and multi-region deployment.

---

## ✅ Deliverables

- GitHub Repository
- Live Deployment Link
- Dockerized Full Stack App
- Architecture Documentation
- Database Schema
- Metric Definitions
- Assumptions & Tradeoffs
- Scalability & MLOps Strategy

---

## 🏁 Summary

This solution:

✔ Ingests AI-generated factory events  
✔ Prevents duplicates  
✔ Handles delayed & unordered data  
✔ Computes time-based productivity metrics  
✔ Scales from 5 → 100+ cameras → multi-site  
✔ Supports model versioning & drift detection  
✔ Built using production-grade architecture  
✔ Fully containerized

