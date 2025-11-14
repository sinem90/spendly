# Spendly Frontend

React-based frontend for the Spendly personal finance application.

## Tech Stack

- **React 18** - UI library
- **React Router 6** - Client-side routing
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls
- **date-fns** - Date manipulation
- **Recharts** - Data visualization (ready for charts)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

The default configuration connects to the backend at `http://localhost:5001/api`.

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:3000

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable components
│   │   ├── Layout.jsx           # Main layout with navigation
│   │   └── ProtectedRoute.jsx  # Auth route wrapper
│   ├── context/         # React Context providers
│   │   └── AuthContext.jsx     # Authentication state
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   ├── Categories.jsx
│   │   └── Budgets.jsx
│   ├── services/        # API service layer
│   │   ├── api.js              # Axios instance with interceptors
│   │   ├── authService.js
│   │   ├── categoryService.js
│   │   ├── budgetService.js
│   │   └── transactionService.js
│   ├── App.jsx          # Main app with routing
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── vite.config.js
└── package.json
```

## Features

### Authentication
- User registration with validation
- Login with JWT tokens
- Protected routes
- Auto-redirect on auth failure
- Token storage in localStorage

### Dashboard
- Overview of total expenses
- Budget status with progress bars
- Spending by category breakdown
- Visual indicators for budget alerts

### Transactions
- List all transactions with filtering
- Add new transactions
- Delete transactions
- Category-based organization
- Type-based (income/expense) filtering
- Date formatting with date-fns

### Categories
- Separate expense and income categories
- Create categories with custom colors
- Color-coded display
- Delete protection (blocks if transactions exist)

### Budgets
- Create monthly budgets per category
- Budget vs actual spending comparison
- Progress bars with color indicators:
  - Green: < 75% used
  - Yellow: 75-90% used
  - Red: > 90% used
- Date range selection
- Remaining amount display

## API Integration

All API calls go through the `services/` layer:

```javascript
import { transactionService } from './services/transactionService';

// Get all transactions
const data = await transactionService.getAll();

// Create transaction
await transactionService.create({
  categoryId: 'uuid',
  amount: 100.00,
  description: 'Groceries',
  transactionDate: '2024-01-15',
  type: 'expense'
});
```

### Authentication Flow

The app uses JWT tokens stored in localStorage:

1. User logs in → receives token
2. Token stored in localStorage
3. axios interceptor adds token to all requests
4. 401 responses trigger auto-logout and redirect

### Protected Routes

All main app routes are protected with `ProtectedRoute`:

```javascript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Layout>
        <Dashboard />
      </Layout>
    </ProtectedRoute>
  }
/>
```

## Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run lint:fix # Fix linting issues
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5001/api |

## Styling

The app uses inline styles for simplicity and portability. Key design principles:

- Clean, minimal interface
- Consistent color scheme:
  - Primary: #2563eb (blue)
  - Success: #10b981 (green)
  - Warning: #f59e0b (yellow)
  - Danger: #ef4444 (red)
- Card-based layout with shadows
- Responsive grid layouts
- Hover states on interactive elements

## Backend Connection

The frontend expects the backend API to be running on `http://localhost:5001`.

Start the backend:
```bash
cd ../backend
npm run dev
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Tips

### Adding a New Page

1. Create page component in `src/pages/`
2. Add route in `App.jsx`
3. Add navigation link in `Layout.jsx`
4. Create service methods in `src/services/` if needed

### Adding API Calls

1. Add method to appropriate service file
2. Use the `api` instance for authenticated requests
3. Handle errors with try/catch

### Debugging

- Check browser console for errors
- Check Network tab for API calls
- Verify backend is running
- Check localStorage for token

## Troubleshooting

### CORS Errors
- Ensure backend CORS is configured for `http://localhost:3000`
- Check backend `.env` file: `CORS_ORIGIN=http://localhost:3000`

### 401 Unauthorized
- Token may be expired (7 day expiration)
- Clear localStorage and login again
- Check backend JWT_SECRET is set

### API Connection Refused
- Verify backend is running on port 5001
- Check vite proxy configuration in `vite.config.js`

## Future Enhancements

- Add data visualization with Recharts
- Implement transaction search and advanced filtering
- Add budget alerts and notifications
- Support for recurring transactions
- Export data to CSV
- Dark mode
- Mobile responsive design
- Offline support with PWA

## License

MIT
