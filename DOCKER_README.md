# Docker Setup for Online Learning Portal

This guide explains how to run the Online Learning Portal using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed

## Services

The application consists of three services:

1. **Frontend**: React application served on port 80
2. **Backend**: Node.js/Express API server on port 3000
3. **PostgreSQL**: Database with persistent volume

## Quick Start

1. **Clone the repository and navigate to the project directory**

2. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000
   - PostgreSQL: localhost:5431 (internal port 5432)

## Docker Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

### Rebuild after changes
```bash
docker-compose up --build
```

## Environment Configuration

### Frontend
- Served on port 80
- Connects to backend service at `http://backend:3000`

### Backend
- Runs on port 3000
- Connects to PostgreSQL at `postgres:5432`
- Uses Google Cloud Storage for file uploads

### Database
- PostgreSQL 15 Alpine
- Persistent data stored in `online-learing-portal-db-volume`
- Default credentials in `Backend/.env`

## Volume Management

The PostgreSQL data is persisted in a Docker volume named `online-learing-portal-db-volume`. To remove all data:

```bash
docker-compose down -v
```

## Troubleshooting

1. **Port conflicts**: Ensure ports 80, 3000, and 5431 are available
2. **Google Cloud credentials**: Ensure `gentle-scene-466610-a2-1436aaba1c89.json` exists in Backend directory
3. **Database connection**: Wait for PostgreSQL to fully initialize before accessing the app

## Development

For development with hot reload, you can run services individually:

```bash
# Run only database
docker-compose up postgres

# Run backend with development server
docker-compose up backend

# Run frontend with Vite dev server
cd Frontend && npm run dev