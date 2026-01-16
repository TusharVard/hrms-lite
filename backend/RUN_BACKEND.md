# Run Backend Server

## Quick Commands

### Start Server (Production)
```bash
cd backend
npm start
```
or
```bash
cd backend
node src/app.js
```

### Start Server (Development with Auto-reload)
```bash
cd backend
npm run dev
```

## Full Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies (if not already installed)
```bash
npm install
```

### 3. Set Up Environment Variables

Create `.env` file in `backend/` directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/hrms_lite?schema=public"
PORT=3000
NODE_ENV=development
```

### 4. Generate Prisma Client
```bash
npx prisma generate --schema=src/prisma/schema.prisma
```

### 5. Run Migrations (if needed)
```bash
npx prisma migrate dev --schema=src/prisma/schema.prisma --name init
```

### 6. Start Server

**Production:**
```bash
npm start
```

**Development (with auto-reload):**
```bash
npm run dev
```

## Server URLs

- **API Base:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/health
- **Root:** http://localhost:3000

## Verify Server is Running

```bash
curl http://localhost:3000/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "..."
}
```

---

**Quick Start:** `cd backend && npm start`
