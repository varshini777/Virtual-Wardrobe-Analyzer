# Virtual Wardrobe Analyzer 👗👔

A modern, functional, and responsive web application that manages your personal digital wardrobe and curates intelligent, rule-based outfit recommendations based on weather, occasion, color harmony, and style preferences.

---

## ✨ Features

### 1. Simplified Clothing Management with Dynamic Product Visuals
- **Quick Add & Edit Modal**:
  - Item Name
  - Category: **Top**, **Bottom**, **Shoes**, or **Accessories**
  - Sub-category: T-shirt, Shirt, Polo, Sweater, Hoodie, Jeans, Chinos, Trousers, Shorts, Sneakers, Loafers, Boots, Oxford Shoes, etc.
  - Color with interactive color swatches (standard fashion palette & custom colors)
  - **Weather Suitability**: *Hot*, *Cold*, *Rainy*, or *All Weather*
  - **Occasion Style**: *Casual*, *Work*, *Formal*, or *All Occasions*
  - **Dynamic Studio Image Assignment**: Automatically matches garments to realistic studio catalog product assets based on sub-category, color, and attributes.
  - **Safe User Uploads**: Supports custom garment photo uploads via `/api/upload` (5MB limit, sanitized UUID filenames, strict image MIME type validation).
  - Optional garment notes (fabric, fit, waterproof details).
- **Digital Closet Grid**:
  - Search by name, color, sub-category, or notes
  - Category filter tabs (*All*, *Top*, *Bottom*, *Shoes*, *Accessories*)
  - Secondary climate and occasion filters
  - One-click sample wardrobe restoration & clear closet tools

### 2. Practical, Rule-Based Outfit Recommendation Engine
- Generates complete ensembles: **Top + Bottom + Shoes** (+ optional **Accessory**).
- **Zero AI / Computer Vision gimmicks**: 100% explainable, deterministic fashion rules.
- **Visual Outfit Cards**: Displays high-fidelity product images for each individual garment in the outfit combination.
- **Context Filters**:
  - **Weather**: *Hot* ☀️, *Cold* ❄️, *Rainy* 🌧️
  - **Occasion**: *Casual* 👕, *Work* 💼, *Formal* 👔
- **Color Coordination & Contrast Theory**:
  - Neutral-on-neutral base versatility (White, Black, Navy, Grey, Beige, Brown)
  - Complementary pairs (Navy & Brown, Olive & Beige, Burgundy & Grey, etc.)
  - Clashing color detection (e.g. Red + Green holiday clash, competing saturated neons)
- **Rainy Weather Footwear Intelligence**:
  - Prioritizes waterproof boots and closed leather shoes only when item details or suitability explicitly indicate waterproofness.
  - Explicitly penalizes sandals, flip-flops, fabric canvas, and white footwear in rainy weather.
- **Graceful Incomplete Wardrobe Handling**:
  - Detects if wardrobe is missing essential categories (Tops, Bottoms, or Shoes)
  - Displays a dedicated warning banner with missing items and direct "+ Add Item" CTA.
- **Explainable Results & Qualitative Harmony Badges**:
  - Detailed, human-readable stylist rationale for why each outfit works.
  - Qualitative style indicators (*"Balanced Contrast"*, *"Stylistically Harmonious"*, *"Climate Optimized"*, *"Palette Aligned"*) instead of misleading pseudo-scientific percentages.
- **Preference-Aware Scoring**:
  - Scores boosted for user's favorite colors (+15 pts).
  - Penalties for disliked colors.
  - Style aesthetic bonuses (Minimalist, Smart Casual, Streetwear, etc.).

### 3. Genuine Authentication & User Data Security
- **Signed JWT Tokens**: Stateless, cryptographically signed JSON Web Tokens (`Authorization: Bearer <token>`).
- **Secure Password Hashing**: Passwords hashed with `bcryptjs` (salt rounds: 10).
- **Strict Server-Side Authorization**: Every protected endpoint derives user identity directly from the verified token—never trusting client-supplied headers.
- **Cross-User Data Isolation**: Clothing items, preferences, saved outfits, and uploads are isolated per account with ownership checks on all mutating operations.
- **One-Click Instant Demo**: Supports quick evaluation via the built-in demo user (`demo` / `demo123`).

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ (Node.js 24 recommended)
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

Run the comprehensive backend unit and integration test suite:
```bash
npm test
```
The test suite verifies 11 critical behaviors:
1. **API Health**: Status and database connectivity.
2. **Authentication**: Registration, Login, Token validation, and 401 rejection.
3. **Cross-User Data Isolation**: Prevents unauthorized reads, updates, deletes, and cross-user outfit creation.
4. **Clothing Item Management**: CRUD operations with dynamic image assignment.
5. **Outfit Recommendation & Persistence**: Recommendation generation with garment images, saving, and retrieval.
6. **Wardrobe Completeness Check**: Verifies missing category detection (Top, Bottom, Shoes).
7. **Weather Suitability - Hot**: Excludes heavy cold garments in hot weather.
8. **Weather Suitability - Cold**: Excludes shorts in cold weather.
9. **Occasion Filtering - Formal**: Excludes T-shirts and shorts for formal occasions.
10. **Color Harmony & Preferences**: Verifies contrast rules and score boosts for favorite colors.
11. **Rainy Weather Suitability**: Prioritizes waterproof boots and penalizes inappropriate footwear.

---

## 📂 Project Architecture

```
Virtual wardrobe Analyzer/
├── client/                     # Vite + React + Tailwind CSS Frontend
│   ├── public/
│   │   └── clothing-assets/    # Realistic studio catalog garment images
│   ├── src/
│   │   ├── api/client.js       # Centralized API service with JWT authentication
│   │   ├── components/         # Reusable UI components
│   │   │   ├── AuthModal.jsx   # Login, registration, & demo access modal
│   │   │   ├── Navbar.jsx      # Navigation, session badge, profile management
│   │   │   ├── ItemCard.jsx    # Garment card with 4:3 catalog visual
│   │   │   ├── ItemModal.jsx   # Add/Edit form with upload & auto-assignment
│   │   │   ├── OutfitCard.jsx  # Multi-garment visual grid with stylist rationale
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
│   │   └── main.jsx
│   └── package.json
├── server/                     # Node.js + Express + SQLite Backend
│   ├── public/
│   │   ├── clothing-assets/    # Static catalog image assets
│   │   └── uploads/            # Secure user uploaded files
│   ├── src/
│   │   ├── db/database.js      # SQLite schema, migrations, sample seeder & image backfill
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT verification middleware & token generation
│   │   ├── services/
│   │   │   ├── recommender.js  # Rule-based outfit recommendation engine
│   │   │   └── imageService.js # Dynamic garment image resolver
│   │   ├── routes/
│   │   │   ├── auth.js         # Register, Login, Demo, Me
│   │   │   ├── items.js        # Clothing items CRUD (protected)
│   │   │   ├── recommendations.js # Status & outfit generation (protected)
│   │   │   ├── outfits.js      # Saved outfits & history (protected)
│   │   │   ├── preferences.js  # Style & color preferences (protected)
│   │   │   └── upload.js       # Secure file upload handler (protected)
│   │   └── server.js           # Express app & static server
│   ├── tests/
│   │   └── api.test.js         # Comprehensive automated integration test suite
│   ├── .env.example
│   ├── .env
│   └── package.json
├── package.json                # Root orchestration scripts
└── README.md
```

---

## 🔌 API Reference

### Authentication Endpoints (Public)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user account (`username`, `password`, `email`) |
| `POST` | `/api/auth/login` | Login with username and password, returns JWT token |
| `POST` | `/api/auth/demo` | Instant access with built-in demo credentials |
| `GET` | `/api/auth/me` | Fetch authenticated user profile (requires `Bearer <token>`) |

### Protected Endpoints (`Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check endpoint |
| `POST` | `/api/upload` | Secure image upload (`multipart/form-data`) |
| `GET` | `/api/items` | List user's clothing items (supports `?category=`, `?weather=`, `?search=`) |
| `POST` | `/api/items` | Add a new clothing item (auto-assigns image if omitted) |
| `GET` | `/api/items/:id` | Get single clothing item details |
| `PUT` | `/api/items/:id` | Update a clothing item |
| `DELETE` | `/api/items/:id` | Remove a clothing item |
| `POST` | `/api/items/reset-sample` | Reset wardrobe to curated starter items with product visuals |
| `DELETE` | `/api/items/clear-all` | Clear all items from user's wardrobe |
| `GET` | `/api/recommendations/status` | Check wardrobe completeness & counts |
| `POST` | `/api/recommendations/generate` | Generate rule-based outfit recommendations with item images |
| `GET` | `/api/outfits` | List user's saved outfits with item images |
| `POST` | `/api/outfits` | Save an outfit combination (validates item ownership) |
| `DELETE` | `/api/outfits/:id` | Delete a saved outfit |
| `GET` | `/api/outfits/history` | List recommendation session history |
| `GET` | `/api/preferences` | Get user color & style preferences |
| `PUT` | `/api/preferences` | Update user preferences |
