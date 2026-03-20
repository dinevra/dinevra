<div align="center">
  <img src="https://via.placeholder.com/800x200?text=Dinevra+Platform" alt="Dinevra Hero" />
</div>

# Dinevra – AI-Native Dining Operating System
> An enterprise-grade, real-time, multi-tenant POS and Kitchen Management ecosystem built for modern dining organizations.

Dinevra replaces disjointed restaurant software with a single high-performance pipeline bridging front-of-house payments with back-of-house orchestration via global WebSocket networks and Stripe BBPOS integration.

## 🚀 Key Features

*   **Multi-Tenant Architecture:** Securely manages locations, multiple kitchen routing topologies, and dynamic menus under umbrella Organizations.
*   **Real-time Kitchen Display System (KDS):** Leverages Go + Redis Pub/Sub + WebSockets to broadcast order status updates globally in under 50ms without polling.
*   **Native Stripe Terminal BBPOS:** End-to-end integration mapping physical reader interaction (`CONNECTING` -> `WAITING_TAP` -> `PROCESSING`) through async `PaymentIntent` webhooks.
*   **Zero-Cost Cloud Architecture:** Uses Terraform to orchestrate the Go API, PostgreSQL, and Redis cache automatically on a single AWS Free-Tier `t2.micro` EC2 Virtual Machine, slashing startup costs to $0.
*   **Tablet Native POS:** Includes an Android Point-Of-Sale Jetpack Compose layout tailored for cashiers using 1280x800 aspect screens.

## ⚙️ Monorepo Structure

*   **[`dinevra-backend/`](./dinevra-backend)** - The Domain-Driven Design Go backend. Houses the core entities, Gin HTTP Handlers, Usecases, WebSockets, and database persistence layers.
*   **[`dinevra-dashboard/`](./dinevra-dashboard)** - The React/Vite/TypeScript web app. Acts as both the organizational Dashboard Control Center and the auto-updating Kanban Kitchen Display System.
*   **[`dinevra-pos/`](./dinevra-pos)** - The native Android Jetpack Compose Point-of-Sale interface featuring dynamic category-switching shopping carts and hardware payment mocks.
*   **[`terraform/`](./terraform)** - Infrastructure-as-code (HCL) blueprints to spin up the entire application inside an AWS VPC.

## 🛠️ Tech Stack

### Core Technologies
*   **Compute:** Go 1.23
*   **Database Engine:** PostgreSQL 15 
*   **Cache & Messaging:** Redis 7
*   **Containerization:** Docker & Docker Compose (`docker-compose.local.yml`)
*   **Cloud Orchestration:** Hashicorp Terraform (AWS Provider)

### Client Technologies
*   **Restaurant Administration:** React 18, Vite, Tailwind CSS, React-Router-DOM, Axios
*   **Hardware POS:** Android SDK (API 34), Jetpack Compose, Kotlin 1.9

## 🏃‍♂️ Getting Started

Want to spin up the entire platform locally without touching AWS or installing heavy development setups? 

*(Requires Docker to be installed)*

```bash
# 1. Start the Orchestrator
docker compose -f docker-compose.local.yml up -d --build

# Your services are now running!
#    • Go API & WebSocket Server -> http://localhost:8080
#    • PostgreSQL DB -> localhost:5432
#    • Redis Pub/Sub -> localhost:6379 

# 2. Start the Frontend Dashboard
cd dinevra-dashboard
npm install
npm run dev
# -> http://localhost:5173
```

## 🧪 Testing

We prioritized independent testability by aggressively mocking our interface boundaries:
```bash
cd dinevra-backend
go test -v ./...
```
Continuous Integration automatically enforces regressions via GitHub Actions (`.github/workflows/ci.yml`).

## ⚖️ License
Please refer to the `LICENSE` file for usage rights and stipulations regarding the Dinevra platform.