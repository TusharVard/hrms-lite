# Run Frontend Locally

## Quick Start

### 1. Navigate to Frontend Directory
```bash
cd frontend/react+javascript
```

### 2. Install Dependencies (if not already installed)
```bash
npm install
```

### 3. Create `.env` File (Optional)

Create `.env` file in `frontend/react+javascript/`:

```env
VITE_API_URL=http://localhost:3000/api
```

**Note:** If `.env` is not created, it will use the fallback: `http://localhost:3000/api`

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open in Browser

The frontend will be available at:
- **Local:** http://localhost:5173
- Or another port if 5173 is busy (check terminal output)

## Prerequisites

- **Backend must be running** on `http://localhost:3000`
- If backend is on a different port, update `.env` file accordingly

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3000/api` | Backend API URL |

## Troubleshooting

### Port Already in Use
- Vite will automatically use the next available port
- Check terminal output for the actual URL

### Can't Connect to Backend
- Ensure backend is running on port 3000
- Check `VITE_API_URL` in `.env` matches your backend URL
- Verify backend CORS allows `http://localhost:5173`

### Dependencies Not Installed
```bash
npm install
```

---

**The dev server is now running!** 🚀
