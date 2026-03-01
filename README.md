# 🏭 AI-Powered Worker Productivity Dashboard

A production-ready, scalable full-stack application for monitoring factory worker productivity using AI-powered CCTV event streams. Built with modern technologies and clean architecture principles.

## 📋 Table of Contents

- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Metrics & Formulas](#metrics--formulas)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Assumptions & Design Decisions](#assumptions--design-decisions)
- [Edge Cases & Error Handling](#edge-cases--error-handling)
- [Scalability Strategy](#scalability-strategy)
- [Model Improvements & MLOps](#model-improvements--mlops)
- [Development Guide](#development-guide)

---

## 🏗️ System Architecture

### High-Level Data Flow

```
┌─────────────────┐
│   CCTV Cameras  │
│   (Edge AI)     │
└────────┬────────┘
         │
         │ AI Events (HTTP POST)
         ▼
┌─────────────────┐      ┌──────────────┐
│  Express.js API │◄────►│   MongoDB    │
│   (Backend)     │      │  (Database)  │
└────────┬────────┘      └──────────────┘
         │
         │ REST API
         ▼
┌─────────────────┐
│   Next.js 14    │
│   (Frontend)    │
│   Dashboard     │
└─────────────────┘
```

### Component Breakdown

1. **Edge Layer (CCTV)**: AI-powered cameras detect worker events (working, idle, absent, product_count)
2. **Backend API**: Express.js server processes events, computes metrics using aggregation pipelines
3. **Database**: MongoDB stores workers, workstations, and events with duplicate prevention
4. **Frontend**: Next.js 14 Server Components render real-time analytics dashboard
5. **Infrastructure**: Docker Compose orchestrates all services

---

## 🛠️ Tech Stack

### Backend

- **Framework**: Express.js (Node.js)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod
- **Logging**: Winston
- **Security**: Helmet, CORS

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: React Server Components (minimal client state)

### Infrastructure

- **Containerization**: Docker + Docker Compose
- **Database**: MongoDB 7.0

---

## 📁 Project Structure

```
ai-productivity-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── eventController.ts   # Event creation
│   │   │   ├── metricsController.ts # Metrics retrieval
│   │   │   └── seedController.ts    # Database seeding
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts      # Global error handler
│   │   │   └── requestLogger.ts     # HTTP logging
│   │   ├── models/
│   │   │   ├── AIEvent.ts           # Event schema
│   │   │   ├── Worker.ts            # Worker schema
│   │   │   └── Workstation.ts       # Workstation schema
│   │   ├── routes/
│   │   │   ├── eventRoutes.ts       # /api/events
│   │   │   ├── metricsRoutes.ts     # /api/metrics
│   │   │   └── seedRoutes.ts        # /api/seed
│   │   ├── services/
│   │   │   ├── metricsService.ts    # Business logic
│   │   │   └── seedService.ts       # Dummy data generator
│   │   ├── utils/
│   │   │   ├── logger.ts            # Winston logger
│   │   │   └── timeUtils.ts         # Time calculations
│   │   ├── validators/
│   │   │   └── eventValidators.ts   # Zod schemas
│   │   └── server.ts                # Express app
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── app/
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Dashboard page
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── ErrorDisplay.tsx         # Error component
│   │   ├── FactorySummaryCards.tsx  # Summary cards
│   │   ├── LoadingSpinner.tsx       # Loading state
│   │   ├── ProductionChart.tsx      # Production charts
│   │   ├── UtilizationChart.tsx     # Utilization charts
│   │   ├── WorkerMetricsTable.tsx   # Worker table
│   │   └── WorkstationMetricsTable.tsx
│   ├── lib/
│   │   ├── api.ts                   # API client
│   │   ├── types.ts                 # TypeScript types
│   │   └── utils.ts                 # Utility functions
│   ├── Dockerfile
│   ├── next.config.mjs
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
├── docker-compose.yml
└── README.md
```

---

## 🗄️ Database Schema

### Workers Collection

Stores factory worker information.

```typescript
{
  worker_id: string; // Unique identifier (e.g., "W001")
  name: string; // Worker name
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-generated
}
```

**Indexes**: `worker_id` (unique)

---

### Workstations Collection

Stores workstation/machine information.

```typescript
{
  station_id: string; // Unique identifier (e.g., "WS001")
  name: string; // Workstation name
  type: string; // Type (e.g., "Assembly", "QC")
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes**: `station_id` (unique)

---

### AIEvents Collection

Stores AI-detected events from CCTV cameras.

```typescript
{
  timestamp: Date;                    // Event timestamp
  worker_id: string;                  // Reference to worker
  workstation_id: string;             // Reference to workstation
  event_type: "working" | "idle" | "absent" | "product_count";
  confidence: number;                 // 0.0 - 1.0
  count?: number;                     // Units produced (for product_count)
  event_hash: string;                 // SHA-256 hash for duplicate prevention
  createdAt: Date;
}
```

**Indexes**:

- `event_hash` (unique) - Prevents duplicate events
- `timestamp` - Fast time-range queries
- `(worker_id, timestamp)` - Compound index for worker metrics
- `(workstation_id, timestamp)` - Compound index for workstation metrics

**Duplicate Prevention Logic**:

```javascript
event_hash = SHA256(timestamp + worker_id + workstation_id + event_type);
```

---

## 📊 Metrics & Formulas

### Worker-Level Metrics

#### 1. Total Active Hours

Sum of time intervals where `event_type = "working"`.

```
active_hours = Σ(time_diff) where prev_event.type = "working"
```

#### 2. Total Idle Hours

Sum of time intervals where `event_type = "idle"`.

```
idle_hours = Σ(time_diff) where prev_event.type = "idle"
```

#### 3. Utilization Percentage

```
utilization_% = (active_hours / (active_hours + idle_hours)) × 100
```

#### 4. Total Units Produced

Sum of all `count` values where `event_type = "product_count"`.

```
total_units = Σ(event.count) where event_type = "product_count"
```

#### 5. Units Per Hour

```
units_per_hour = total_units_produced / total_active_hours
```

---

### Workstation-Level Metrics

#### 1. Occupancy Hours

Sum of time intervals where workstation is occupied (working OR idle).

```
occupancy_hours = Σ(time_diff) where event_type IN ["working", "idle"]
```

#### 2. Utilization Percentage

```
utilization_% = (active_hours / occupancy_hours) × 100
```

#### 3. Throughput Rate

```
throughput_rate = total_units_produced / occupancy_hours
```

---

### Factory-Level Metrics

#### 1. Total Productive Hours

```
total_productive_hours = Σ(worker.total_active_hours)
```

#### 2. Average Production Rate

```
avg_production_rate = total_production_count / total_productive_hours
```

#### 3. Average Utilization

```
avg_utilization = Σ(worker.utilization_%) / total_workers
```

---

### Time Difference Calculation Logic

**Key Assumptions**:

1. Events are sorted by timestamp (handles out-of-order events)
2. Time difference is calculated between consecutive events
3. Gaps > 8 hours are ignored (overnight/shift changes)
4. Only events with `confidence >= 0.7` are included

**Algorithm**:

```typescript
for i = 0 to events.length - 2:
  current = events[i]
  next = events[i + 1]

  time_diff = (next.timestamp - current.timestamp) / 3600  // hours

  if time_diff < 8:  // Ignore overnight gaps
    if current.event_type == "working":
      active_hours += time_diff
    else if current.event_type == "idle":
      idle_hours += time_diff
```

---

## 🚀 Getting Started

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

### Quick Start

1. **Clone the repository**:

```bash
git clone <repository-url>
cd ai-productivity-dashboard
```

2. **Start all services**:

```bash
docker-compose up --build
```

3. **Wait for services to start** (30-60 seconds):
   - MongoDB: http://localhost:27017
   - Backend API: http://localhost:5000
   - Frontend Dashboard: http://localhost:3000

4. **Seed the database** (in a new terminal):

```bash
curl -X POST http://localhost:5000/api/seed
```

5. **Access the dashboard**:
   - Open browser: http://localhost:3000

### Manual Installation (without Docker)

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### MongoDB

Ensure MongoDB is running on `mongodb://localhost:27017`

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Endpoints

#### 1. Create Event

```http
POST /api/events
Content-Type: application/json

{
  "timestamp": "2026-03-01T10:00:00Z",
  "worker_id": "W001",
  "workstation_id": "WS001",
  "event_type": "working",
  "confidence": 0.95,
  "count": 0
}
```

**Response**:

```json
{
  "success": true,
  "data": { ... }
}
```

---

#### 2. Create Events Batch

```http
POST /api/events/batch
Content-Type: application/json

{
  "events": [
    { ... },
    { ... }
  ]
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "inserted": 45,
    "duplicates": 5,
    "total": 50
  }
}
```

---

#### 3. Get Factory Metrics

```http
GET /api/metrics/factory
```

**Response**:

```json
{
  "success": true,
  "data": {
    "total_productive_hours": 245.67,
    "total_production_count": 3452,
    "average_production_rate": 14.05,
    "average_utilization_percentage": 78.45,
    "total_workers": 6,
    "total_workstations": 6,
    "active_workers": 5
  }
}
```

---

#### 4. Get Worker Metrics

```http
GET /api/metrics/workers?worker_id=W001
```

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "worker_id": "W001",
      "worker_name": "John Smith",
      "total_active_hours": 42.5,
      "total_idle_hours": 5.3,
      "utilization_percentage": 88.9,
      "total_units_produced": 567,
      "units_per_hour": 13.34
    }
  ]
}
```

---

#### 5. Get Workstation Metrics

```http
GET /api/metrics/workstations?workstation_id=WS001
```

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "station_id": "WS001",
      "station_name": "Assembly Line A",
      "occupancy_hours": 48.2,
      "utilization_percentage": 85.3,
      "total_units_produced": 678,
      "throughput_rate": 14.07
    }
  ]
}
```

---

#### 6. Seed Database

```http
POST /api/seed
```

**Response**:

```json
{
  "success": true,
  "message": "Database seeded successfully"
}
```

---

## 🧩 Assumptions & Design Decisions

### Time Difference Calculation

1. **Consecutive Event Pairing**: Time is calculated between consecutive events for the same entity
2. **8-Hour Gap Threshold**: Time differences > 8 hours are discarded (assumed overnight/shift changes)
3. **Event Ordering**: Events are sorted by timestamp before processing to handle out-of-order arrivals
4. **State Duration**: The duration of an event state lasts until the next event occurs

### Event Aggregation

1. **Confidence Threshold**: Only events with `confidence >= 0.7` are included in metrics
2. **Product Count Handling**: `product_count` events are atomic (not duration-based)
3. **Absent Events**: Currently not factored into utilization (could be added as downtime)

### Missing Event Handling

1. **No Extrapolation**: If no "end" event exists, the duration is not estimated
2. **Partial Shifts**: Workers with incomplete data still contribute valid metrics for available periods

---

## ⚠️ Edge Cases & Error Handling

### 1. Duplicate Events

**Problem**: Same event sent multiple times (network retry, system failure)

**Solution**:

- SHA-256 hash generated from `(timestamp, worker_id, workstation_id, event_type)`
- Unique index on `event_hash` field
- Duplicates return `409 Conflict` status

**Implementation**:

```typescript
event_hash = SHA256(timestamp + worker_id + workstation_id + event_type);
```

---

### 2. Out-of-Order Events

**Problem**: Events arrive in wrong chronological order due to network latency

**Solution**:

- Events sorted by timestamp before metric computation
- Aggregation pipeline uses `$sort` stage
- Time differences calculated on sorted array

**Example**:

```
Received: [Event3, Event1, Event2]
Processed: [Event1, Event2, Event3]
```

---

### 3. Intermittent Connectivity

**Problem**: Edge cameras lose internet connection, batch events later

**Solution**:

- Batch event API endpoint `/api/events/batch`
- Graceful handling of duplicate events in batch
- Returns summary: `{inserted: X, duplicates: Y}`

---

### 4. Missing Worker/Workstation References

**Problem**: Event references non-existent worker or workstation

**Solution**:

- Database enforces referential integrity through lookups
- Seeding ensures all workers/workstations exist
- API validation checks IDs before insertion (can be added)

---

### 5. Confidence Threshold Edge Cases

**Problem**: All events below confidence threshold

**Solution**:

- If no high-confidence events exist, metrics return zeros
- Frontend displays "No data available" message
- Configurable threshold in `metricsService.ts`

---

### 6. Time Zone Handling

**Problem**: CCTV cameras in different time zones

**Solution**:

- All timestamps stored as UTC `ISODate`
- Frontend converts to local timezone for display
- Backend processes all times in UTC

---

## 📈 Scalability Strategy

### Current System (5-10 Cameras)

- **Request Pattern**: ~1 event/second per camera
- **Architecture**: Monolithic Express API
- **Database**: Single MongoDB instance
- **Performance**: Handles 10 cameras comfortably

---

### Scaling to 100+ Cameras

#### 1. **Backend Horizontal Scaling**

**Challenge**: 100 cameras = ~100 events/second

**Solution**:

- Deploy multiple backend instances behind load balancer
- Use stateless API design (already implemented)
- Sticky sessions NOT required

```yaml
# docker-compose scaling
docker-compose up --scale backend=5
```

**Load Balancer** (Nginx):

```nginx
upstream backend_cluster {
  server backend1:5000;
  server backend2:5000;
  server backend3:5000;
}
```

---

#### 2. **Database Optimization**

**Challenge**: High write throughput

**Solutions**:

a) **MongoDB Sharding**:

```javascript
// Shard by worker_id
sh.shardCollection("ai_productivity.aievents", { worker_id: 1, timestamp: 1 });
```

b) **Write Concern Optimization**:

```javascript
{ writeConcern: { w: 1, j: false } }  // Faster writes
```

c) **Read Replicas**:

- Write to primary, read metrics from secondaries
- Reduces load on primary

d) **Indexes**:

- Compound indexes already implemented
- Monitor slow queries with `explain()`

---

#### 3. **Message Queue Architecture**

**Challenge**: Decouple event ingestion from processing

**Solution**: Add Kafka/RabbitMQ

```
Edge Cameras → Backend API → Kafka → Consumer Workers → MongoDB
                    ↓
              (Immediate Ack)
```

**Benefits**:

- Buffering during traffic spikes
- Retry logic for failures
- Parallel processing

**Implementation** (Kafka):

```javascript
// Producer (Backend API)
await producer.send({
  topic: "ai-events",
  messages: [{ value: JSON.stringify(event) }],
});

// Consumer (Worker Service)
consumer.on("message", async (message) => {
  await AIEvent.create(JSON.parse(message.value));
});
```

---

#### 4. **Caching Layer**

**Challenge**: Repeated metric queries

**Solution**: Redis cache

```javascript
// Cache factory metrics for 30 seconds
const cachedMetrics = await redis.get("factory:metrics");
if (cachedMetrics) return JSON.parse(cachedMetrics);

const metrics = await getFactoryMetrics();
await redis.setex("factory:metrics", 30, JSON.stringify(metrics));
```

**Cache Strategy**:

- TTL: 30-60 seconds (acceptable staleness)
- Invalidate on critical events
- Cache per-worker and per-workstation metrics

---

#### 5. **Multi-Site Scaling**

**Challenge**: Multiple factories across locations

**Solutions**:

a) **Regional Databases**:

```
Factory A (US)     →  MongoDB Cluster US
Factory B (Europe) →  MongoDB Cluster EU
Factory C (Asia)   →  MongoDB Cluster APAC
```

b) **Central Analytics DB**:

- Regional DBs sync to central warehouse
- Use Change Data Capture (CDC)
- Global dashboard queries central DB

c) **Multi-Tenancy**:

```javascript
// Add factory_id to all schemas
{
  factory_id: "FACTORY_US_01",
  worker_id: "W001",
  ...
}
```

---

#### 6. **Metrics Computation Optimization**

**Challenge**: Aggregation pipelines slow with millions of events

**Solutions**:

a) **Pre-Aggregated Collections**:

```javascript
// Hourly rollup collection
{
  worker_id: "W001",
  date: "2026-03-01",
  hour: 10,
  active_minutes: 45,
  idle_minutes: 15,
  units_produced: 23
}
```

b) **Scheduled Jobs**:

- Compute daily summaries at midnight
- Dashboards query summaries, not raw events

c) **Time-Series Optimizations**:

- Use MongoDB Time-Series Collections (6.0+)
- Automatic bucketing and compression

---

### Performance Targets

| Cameras | Events/sec | Response Time | Architecture       |
| ------- | ---------- | ------------- | ------------------ |
| 5       | 5          | < 100ms       | Monolithic         |
| 50      | 50         | < 200ms       | Load Balanced      |
| 100     | 100        | < 300ms       | + Kafka            |
| 500+    | 500+       | < 500ms       | + Sharding + Cache |

---

## 🤖 Model Improvements & MLOps

### Model Versioning

**Problem**: AI model updates change event accuracy

**Solution**: Add `model_version` field to events

```typescript
{
  timestamp: Date,
  worker_id: string,
  workstation_id: string,
  event_type: string,
  confidence: number,
  model_version: "v2.3.1",  // NEW FIELD
  count?: number
}
```

**Benefits**:

- Compare performance between model versions
- Filter by model version for A/B testing
- Rollback if new model underperforms

**Query Example**:

```javascript
// Metrics only from latest model
db.aievents.find({ model_version: "v2.3.1", confidence: { $gte: 0.7 } });
```

---

### Drift Detection Strategy

**Problem**: Model accuracy degrades over time (concept drift)

**Solution**: Monitor confidence score distribution

**Implementation**:

```javascript
// Daily job to check confidence drift
const avgConfidence = await AIEvent.aggregate([
  {
    $match: {
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  },
  {
    $group: {
      _id: "$event_type",
      avg_confidence: { $avg: "$confidence" },
    },
  },
]);

// Alert if avg_confidence drops below 0.8
if (avgConfidence.working < 0.8) {
  sendAlert("Model drift detected for 'working' events");
}
```

**Metrics to Monitor**:

1. Average confidence per event type
2. Event type distribution (imbalanced data)
3. Rejection rate (confidence < 0.7)
4. Manual verification mismatch rate

---

### Retraining Trigger Concept

**Trigger Conditions**:

1. **Confidence Drop**: Avg confidence < 0.75 for 3 consecutive days
2. **Rejection Rate Spike**: > 30% events below threshold
3. **Manual Feedback**: Operators flag incorrect detections

**Automated Pipeline**:

```
Drift Detected → Export Recent Events → Retrain Model →
Deploy to Canary Cameras → A/B Test → Full Rollout
```

**Data Export for Retraining**:

```javascript
// Export low-confidence events for manual labeling
db.aievents
  .find({
    confidence: { $lt: 0.8 },
    timestamp: { $gte: ISODate("2026-02-01") },
  })
  .forEach((event) => {
    exportForLabeling(event);
  });
```

---

### Feedback Loop

**Add `verified` field** for manual corrections:

```typescript
{
  timestamp: Date,
  worker_id: string,
  event_type: "working",
  confidence: 0.65,
  verified: true,           // NEW: Operator confirmed
  corrected_type: null      // NEW: If operator changed type
}
```

**Benefits**:

- Ground truth dataset for retraining
- Measure precision/recall
- Identify systematic errors

---

## 👨‍💻 Development Guide

### Running Tests

_Note: Test files not included in this scaffold, but structure supports Jest._

```bash
cd backend
npm test
```

### Linting

```bash
cd backend
npm run lint

cd ../frontend
npm run lint
```

### Environment Variables

#### Backend (.env)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai_productivity
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=info
```

#### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Adding New Metrics

1. Define calculation logic in `backend/src/services/metricsService.ts`
2. Add TypeScript interface in `frontend/lib/types.ts`
3. Create visualization component in `frontend/components/`
4. Update dashboard page in `frontend/app/page.tsx`

### Database Migrations

MongoDB is schema-less, but for structural changes:

1. Write migration script in `backend/src/migrations/`
2. Run manually or via scheduled job
3. Update Mongoose schemas

Example:

```javascript
// Add factory_id to all documents
db.aievents.updateMany({}, { $set: { factory_id: "DEFAULT" } });
```

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📞 Support

For issues and questions:

- Open GitHub Issue
- Email: support@example.com

---

## 🎯 Summary

This is a **production-ready, scalable** AI-powered productivity dashboard that:

✅ Handles **duplicate events** with hash-based deduplication  
✅ Processes **out-of-order events** with timestamp sorting  
✅ Computes **accurate time-based metrics** using aggregation pipelines  
✅ Scales from **5 to 500+ cameras** with architectural patterns  
✅ Supports **MLOps workflows** with model versioning and drift detection  
✅ Follows **clean architecture** with separation of concerns  
✅ Uses **modern tech stack** (Next.js 14, TypeScript, MongoDB)  
✅ Runs with **one command**: `docker-compose up --build`

**Happy Monitoring! 🚀**
#   A I - W o r k e r - P r o d u c t i v i t y - D a s h b o a r d  
 