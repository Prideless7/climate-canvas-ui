# Climate Canvas UI

A meteorological data visualization application built with React, TypeScript, and Supabase.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **bun** (optional, faster alternative)

## Installation Steps

### 1. Copy the Project
Copy all project files to your target computer.

### 2. Install Dependencies
Open a terminal in the project directory and run:

```bash
npm install
```

Or if you're using bun:
```bash
bun install
```

### 3. Set Up Environment Variables
Create a `.env` file in the project root with the following content:

```env
VITE_SUPABASE_PROJECT_ID="hhjqsfcqiabfqntmesle"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoanFzZmNxaWFiZnFudG1lc2xlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mzc5NzMsImV4cCI6MjA2ODUxMzk3M30.5c8e5aUwO-zusGRG4uGA4yvNRXd86LByJGhtkUw8vo0"
VITE_SUPABASE_URL="https://hhjqsfcqiabfqntmesle.supabase.co"
```

## Running the Application

### Development Mode
To run the application in development mode with hot reload:

```bash
npm run dev
```

Or with bun:
```bash
bun run dev
```

The application will be available at: `http://localhost:8080`

### Production Build
To create an optimized production build:

```bash
npm run build
```

Or with bun:
```bash
bun run build
```

The build output will be in the `dist` folder.

### Preview Production Build
To preview the production build locally:

```bash
npm run preview
```

Or with bun:
```bash
bun run preview
```

## Project Structure

```
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API services
│   ├── integrations/    # Supabase integration
│   └── lib/             # Utility functions
├── supabase/            # Supabase configuration and functions
└── public/              # Static assets
```

## Key Features

- 📊 Interactive meteorological data charts
- 🗺️ Leaflet map integration
- 📈 Temperature, humidity, rainfall, and solar radiation visualizations
- 🔐 User authentication with Supabase
- 📱 Responsive design
- 📥 CSV data import functionality
- 📄 PDF export capabilities

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Supabase** - Backend & authentication
- **Recharts** - Data visualization
- **Leaflet** - Maps
- **React Router** - Routing

## Troubleshooting

### Port Already in Use
If port 8080 is already in use, you can modify the port in `vite.config.ts`:
```typescript
server: {
  host: "::",
  port: 3000, // Change to your preferred port
}
```

### Build Errors
If you encounter build errors:
1. Delete `node_modules` folder
2. Delete `package-lock.json` (or `bun.lockb`)
3. Run `npm install` (or `bun install`) again

### Environment Variables Not Loading
Make sure the `.env` file is in the root directory (same level as `package.json`).

## Support

For issues or questions, please refer to the [Lovable documentation](https://docs.lovable.dev/).
