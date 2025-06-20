# DeFiLlama Dashboard

A modern, full-featured DeFi dashboard built with React, Vite, TypeScript, and SCSS Modules. It fetches data from the DeFiLlama API and displays it using interactive tables and charts. Includes user authentication, news, theming, and more. **Fully mobile-friendly and responsive design.**

---

## ✨ Features

- **Mobile-Friendly & Responsive**: Works seamlessly on mobile, tablet, and desktop devices with adaptive layouts and touch-friendly UI.
- **User Authentication**: Sign up, sign in, and protected routes for secure access to features.
- **DeFi Coins Table**: View, sort, and filter DeFi coins with detailed pages for each coin.
- **Protocols Table**: Explore DeFi protocols with sortable/filterable tables and protocol details.
- **Interactive Charts**:
  - TVL (Total Value Locked) chart
  - Stablecoin market chart
  - Average Percentage Yield (APY) chart
- **DeFi News Feed**: Stay updated with the latest DeFi news, with detailed news pages.
- **Theming**: Toggle between light and dark mode for a personalized experience.
- **Navigation**: Modern navbar and header for easy access to all features.
- **Error Handling**: User-friendly error messages and loading skeletons for smooth UX.
- **Testing**: Comprehensive unit and integration tests with high coverage.
- **Backend API**: Node.js/Express backend for authentication and comments.
- **Ready to Deploy**: Optimized for Vercel deployment.

---

## 📸 Screenshots

> _Add screenshots or GIFs here to showcase the dashboard UI_

---

## 📦 Tech Stack

- React
- TypeScript
- Vite
- SCSS Modules
- Axios
- React Query
- Recharts
- TanStack Table
- React Router
- Framer Motion
- Node.js/Express (backend)

---

## 🗂️ Project Structure

```
DefiLlama-Dashboard/
  ├── backend/           # Node.js/Express backend (auth, comments)
  └── src/               # Frontend React app
      ├── components/    # Charts, tables, layout, news, auth, etc.
      ├── hooks/         # Custom React Query hooks
      ├── context/       # Auth and theme context providers
      ├── pages/         # Auth pages (SignIn, SignUp)
      ├── services/      # API service modules
      ├── utils/         # Utility functions
      └── App.tsx        # App shell with routing
```

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/defillama-dashboard.git
cd defillama-dashboard

# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

---

## 🛠 Build for Production

```bash
npm run build
```

---

## 🔄 Preview Build

```bash
npm run preview
```

---

## ☁️ Deploying to Vercel

- Ensure you're logged into Vercel
- Run `vercel` or link the GitHub repo to Vercel and follow the deploy flow.
- Build Command: `vite build`
- Output Directory: `dist`

---

## 🧪 Testing & Coverage

- Run all tests:
  ```bash
  npm test
  ```
- Run with coverage:
  ```bash
  npx jest --coverage
  ```
- Tests cover components, hooks, context, and services.

---

## 📄 License

MIT

---

_Made with ❤️ using the DeFiLlama API_

