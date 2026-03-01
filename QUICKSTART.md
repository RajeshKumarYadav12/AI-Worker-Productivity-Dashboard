# 🚀 AI-Powered Worker Productivity Dashboard - Quick Start

## 📊 What You've Got

A **production-ready, full-stack application** for monitoring factory worker productivity using AI-powered CCTV event streams.

### Tech Stack

- **Backend**: Express.js + TypeScript + MongoDB + Mongoose
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Recharts
- **Infrastructure**: Docker + Docker Compose
- **Architecture**: Clean architecture with separation of concerns

---

## ⚡ Quick Start (3 Steps)

### Windows Users:

```bash
cd d:\MovedFromC\Desktop\assign11
start.bat
```

### Mac/Linux Users:

```bash
cd /path/to/assign11
chmod +x start.sh
./start.sh
```

### Manual Start:

```bash
docker-compose up --build
```

Then seed the database:

```bash
curl -X POST http://localhost:5000/api/seed
```

---

## 🌐 Access Points

- **Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017

---

## 📁 Project Structure (56 Files Created)

```
assign11/
├── backend/                  # Express.js API (26 files)
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── controllers/     # Request handlers (event, metrics, seed)
│   │   ├── middleware/      # Error handler, logger
│   │   ├── models/          # Mongoose schemas (Worker, Workstation, AIEvent)
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic (metrics computation)
│   │   ├── utils/           # Time utils, logger
│   │   └── validators/      # Zod schemas
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                 # Next.js Dashboard (20 files)
│   ├── app/                 # Pages (layout, dashboard)
│   ├── components/          # React components (tables, charts)
│   ├── lib/                 # API client, types, utils
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml       # Orchestration (3 services)
├── README.md                # Comprehensive documentation
├── API_EXAMPLES.md          # API testing commands
├── start.bat / start.sh     # Quick start scripts
└── .gitignore
```

---

## 🎯 Key Features Implemented

### Backend

✅ **Event Management**

- POST `/api/events` - Create single event
- POST `/api/events/batch` - Bulk event creation
- Duplicate prevention using SHA-256 hash
- Out-of-order event handling with timestamp sorting

✅ **Metrics Computation**

- GET `/api/metrics/factory` - Factory-wide stats
- GET `/api/metrics/workers` - Worker productivity
- GET `/api/metrics/workstations` - Workstation performance
- Efficient MongoDB aggregation pipelines

✅ **Database Seeding**

- POST `/api/seed` - Reset and seed with 7 days of dummy data
- 6 workers × 6 workstations
- Realistic event patterns

✅ **Production Features**

- Winston logging
- Zod validation
- Helmet security headers
- CORS configuration
- Error handling middleware
- Health check endpoint

### Frontend

✅ **Dashboard Components**

- Factory summary cards (6 key metrics)
- Worker metrics table
- Workstation metrics table
- Utilization bar charts (Recharts)
- Production line charts

✅ **Technical Implementation**

- Next.js 14 Server Components
- Real-time data fetching
- Tailwind CSS styling
- Loading and error states
- TypeScript type safety

### Database

✅ **3 Collections**

- Workers (6 pre-seeded)
- Workstations (6 pre-seeded)
- AIEvents (1000+ dummy events)

✅ **Indexes**

- `event_hash` (unique) - Prevents duplicates
- `timestamp` - Fast time queries
- Compound indexes on `worker_id + timestamp` and `workstation_id + timestamp`

---

## 📊 Metrics Computed

### Worker Level

1. **Total Active Hours** - Time spent working
2. **Total Idle Hours** - Time spent idle
3. **Utilization %** - `active / (active + idle) × 100`
4. **Total Units Produced** - Sum of product_count events
5. **Units Per Hour** - `units / active_hours`

### Workstation Level

1. **Occupancy Hours** - Time station is occupied
2. **Utilization %** - `active / occupancy × 100`
3. **Total Units Produced** - Output from station
4. **Throughput Rate** - `units / occupancy_hours`

### Factory Level

1. **Total Productive Hours** - Sum of all worker active hours
2. **Total Production Count** - Sum of all units
3. **Average Production Rate** - `total_units / total_hours`
4. **Average Utilization %** - Mean of all worker utilization

---

## 🧪 Testing the API

See [API_EXAMPLES.md](API_EXAMPLES.md) for curl commands.

**Quick test**:

```bash
# Health check
curl http://localhost:5000/health

# Get factory metrics
curl http://localhost:5000/api/metrics/factory | jq '.'

# Create an event
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2026-03-01T10:00:00Z",
    "worker_id": "W001",
    "workstation_id": "WS001",
    "event_type": "working",
    "confidence": 0.95
  }'
```

---

## 🔧 Common Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Remove volumes (full reset)
docker-compose down -v
```

---

## 📖 Documentation Highlights

The [README.md](README.md) includes:

1. **Architecture** - Data flow diagram
2. **Database Schema** - Detailed field descriptions
3. **Metrics Formulas** - Mathematical definitions
4. **Assumptions** - Time calculation logic
5. **Edge Cases** - Duplicate events, out-of-order, connectivity
6. **Scalability** - From 5 to 500+ cameras
   - Horizontal scaling
   - Database sharding
   - Message queues (Kafka)
   - Caching (Redis)
   - Multi-site deployment
7. **MLOps** - Model versioning, drift detection, retraining triggers

---

## 🎨 Dashboard Preview

The dashboard displays:

```
┌─────────────────────────────────────────────────┐
│  Factory Productivity Dashboard                 │
├─────────────────────────────────────────────────┤
│  [Total Hours] [Production] [Rate] [Util%] ... │
├─────────────────────────────────────────────────┤
│  📊 Worker Utilization Chart                    │
│  📊 Workstation Utilization Chart               │
├─────────────────────────────────────────────────┤
│  📈 Worker Production Rate Chart                │
│  📈 Workstation Throughput Chart                │
├─────────────────────────────────────────────────┤
│  📋 Worker Metrics Table (sortable)             │
│  📋 Workstation Metrics Table (sortable)        │
└─────────────────────────────────────────────────┘
```

---

## ✅ Production-Ready Checklist

- [x] TypeScript everywhere
- [x] Clean architecture (models, services, controllers)
- [x] MongoDB indexes for performance
- [x] Duplicate event prevention
- [x] Out-of-order event handling
- [x] Confidence threshold filtering
- [x] Winston logging
- [x] Error handling middleware
- [x] Zod validation
- [x] Docker containerization
- [x] Health checks
- [x] Environment variable configuration
- [x] Tailwind CSS styling
- [x] Server-side rendering (Next.js)
- [x] Real-time data fetching
- [x] Responsive design
- [x] Comprehensive documentation

---

## 🚀 Next Steps (Optional Enhancements)

1. **Add Authentication** - JWT tokens for API security
2. **Add WebSockets** - Real-time dashboard updates
3. **Add Tests** - Jest unit tests for services
4. **Add CI/CD** - GitHub Actions pipeline
5. **Add Alerting** - Email/Slack notifications for low utilization
6. **Add Date Filters** - Filter dashboard by date range
7. **Add Export** - CSV/PDF report generation
8. **Add User Management** - Multi-tenant support

---

## 📞 Support

- Full documentation: [README.md](README.md)
- API examples: [API_EXAMPLES.md](API_EXAMPLES.md)
- Issues: Create GitHub issue

---

## 🎉 Success Criteria

If you see this on http://localhost:3000, you're good to go! ✅

```
✅ Factory metrics displayed
✅ Worker table populated
✅ Workstation table populated
✅ Charts rendering
✅ No errors in console
```

**Happy Coding! 🚀**
