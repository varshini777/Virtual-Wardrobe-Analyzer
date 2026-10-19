# Virtual Wardrobe Analyzer 👗👔

A modern, functional, and responsive web application that manages your personal digital wardrobe and curates intelligent, rule-based outfit recommendations based on weather, occasion, color harmony, and style preferences.

---

## ✨ Features

### 1. Simplified Clothing Management
- **Quick Add & Edit Modal**:
  - Item Name
  - Category: **Top**, **Bottom**, **Shoes**, or **Accessories**
  - Sub-category: T-shirt, Shirt, Polo, Sweater, Hoodie, Jeans, Chinos, Trousers, Shorts, Sneakers, Loafers, Boots, Formal Shoes, etc.
  - Color with interactive color swatches (standard fashion palette & custom colors)
  - **Weather Suitability**: *Hot*, *Cold*, *Rainy*, or *All Weather*
  - **Occasion Style**: *Casual*, *Work*, *Formal*, or *All Occasions*
  - Optional image URL or upload for visual display
  - Optional garment notes (fabric, fit, pairing notes)
- **Digital Closet Grid**:
  - Search by name, color, sub-category, or notes
  - Category filter tabs (*All*, *Top*, *Bottom*, *Shoes*, *Accessories*)
  - Secondary climate and occasion filters
  - One-click sample wardrobe restoration & clear closet tools

### 2. Practical, Rule-Based Outfit Recommendation Engine
- Generates complete ensembles: **Top + Bottom + Shoes** (+ optional **Accessory**).
- **Zero AI / Computer Vision gimmicks**: 100% explainable, deterministic fashion rules.
- **Context Filters**:
  - **Weather**: *Hot* ☀️, *Cold* ❄️, *Rainy* 🌧️
  - **Occasion**: *Casual* 👕, *Work* 💼, *Formal* 👔
- **Color Coordination & Contrast Theory**:
  - Neutral-on-neutral base versatility (White, Black, Navy, Grey, Beige, Brown)
  - Complementary pairs (Navy & Brown, Olive & Beige, Burgundy & Grey, etc.)
  - Clashing color detection (e.g. Red + Green holiday clash, competing saturated neons)
- **Graceful Incomplete Wardrobe Handling**:
  - Detects if wardrobe is missing essential categories (Tops, Bottoms, or Shoes)
  - Displays a dedicated warning banner with missing items and direct "+ Add Item" CTA.
- **Explainable Results**:
  - Detailed, human-readable stylist explanation for why each outfit works.
  - Compatibility match score (70% - 99%).
- **Preference-Aware Scoring**:
  - Scores boosted for user's favorite colors (+15 pts).
  - Penalties for disliked colors.
  - Style aesthetic bonuses (Minimalist, Smart Casual, Streetwear, etc.).

### 3. Persistent Storage & Private Wardrobe Isolation
- SQLite database (`wardrobe.db`) storing clothing items, preferences, saved outfits, and recommendation history.
- Multi-user / profile isolation via `x-user-id` header and localStorage.
- Environment variable configuration (`.env`).

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ (Node.js 24 installed)
- npm or pnpm

### Installation
From the root directory:
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### Running the Application

#### Production Mode (Single Command)
Builds the client and starts the backend server which serves both the REST API and the frontend at `http://localhost:5000`:
```bash
npm run build
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

#### Development Mode (Concurrent / Separate)
Run the backend with file watching and the Vite frontend with hot-module replacement:
```bash
# Terminal 1: Backend API (port 5000)
npm run server:dev

# Terminal 2: Vite React Frontend (port 5173)
npm run client
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🧪 Running Automated Tests

Run the backend unit and integration test suite:
```bash
npm test
```
The test suite covers:
1. **Wardrobe Completeness Check**: Verifies missing category detection (Top, Bottom, Shoes).
2. **Weather Suitability Rules**: Verifies hot weather excludes winter sweaters, cold weather excludes shorts, rainy weather prioritizes boots.
3. **Occasion Formality Rules**: Verifies formal occasions exclude gym shorts and graphic tees.
4. **Color Harmony Matrix**: Verifies contrast rules, clashing penalties, and favorite color score boosts.
5. **API CRUD Operations**: Tests adding, editing, deleting, and fetching clothing items.
6. **Recommendation API**: Tests generation and explainability output.
7. **User Preferences & Isolation**: Tests profile-specific persistence.

---

## 📂 Project Architecture

```
Virtual wardrobe Analyzer/
├── client/                     # Vite + React + Tailwind CSS Frontend
│   ├── src/
│   │   ├── api/client.js       # Centralized API service with user isolation
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ItemCard.jsx
│   │   │   ├── ItemModal.jsx
│   │   │   ├── OutfitCard.jsx
│   │   │   ├── MissingItemsAlert.jsx
│   │   │   ├── ColorSwatch.jsx
│   │   │   └── Toast.jsx
│   │   ├── pages/              # Application views
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── WardrobePage.jsx
│   │   │   ├── RecommendationsPage.jsx
│   │   │   ├── SavedOutfitsPage.jsx
│   │   │   └── PreferencesPage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/                     # Node.js + Express + SQLite Backend
│   ├── src/
│   │   ├── db/database.js      # SQLite schema, migrations, sample wardrobe seeder
│   │   ├── services/
│   │   │   └── recommender.js  # Rule-based outfit recommendation engine
│   │   ├── routes/
│   │   │   ├── items.js        # Clothing items CRUD
│   │   │   ├── recommendations.js # Status & outfit generation
│   │   │   ├── outfits.js      # Saved outfits & history
│   │   │   ├── preferences.js  # Style & color preferences
│   │   │   └── users.js        # User profile isolation
│   │   └── server.js           # Express app & static server
│   ├── tests/
│   │   ├── recommender.test.js # Engine unit tests
│   │   └── api.test.js         # API integration tests
│   ├── .env.example
│   ├── .env
│   └── package.json
├── package.json                # Root orchestration scripts
└── README.md
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check endpoint |
| `GET` | `/api/items` | List user's clothing items (supports `?category=`, `?weather=`, `?search=`) |
| `POST` | `/api/items` | Add a new clothing item |
| `GET` | `/api/items/:id` | Get single clothing item details |
| `PUT` | `/api/items/:id` | Update a clothing item |
| `DELETE` | `/api/items/:id` | Remove a clothing item |
| `POST` | `/api/items/reset-sample` | Reset wardrobe to curated starter items |
| `DELETE` | `/api/items/clear-all` | Clear all items from wardrobe |
| `GET` | `/api/recommendations/status` | Check wardrobe completeness & counts |
| `POST` | `/api/recommendations/generate` | Generate rule-based outfit recommendations |
| `GET` | `/api/outfits` | List user's saved outfits |
| `POST` | `/api/outfits` | Save an outfit combination |
| `DELETE` | `/api/outfits/:id` | Delete a saved outfit |
| `GET` | `/api/outfits/history` | List recommendation session history |
| `GET` | `/api/preferences` | Get user color & style preferences |
| `PUT` | `/api/preferences` | Update user preferences |
| `GET` | `/api/users` | List available user profiles |
| `POST` | `/api/users` | Create/switch user profile |
