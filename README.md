# 🐾 Rescue Connect — Full Stack Animal Rescue Volunteer Platform

AngularJS 1.x frontend + Node.js/Express backend + MongoDB (primary DB, view with
MongoDB Compass) + optional MySQL companion store for the admin Fund Received page.

---

## 1. Project Structure

```
rescue-connect/
├── backend/
│   ├── config/         db.js (MongoDB), mysql.js (MySQL pool)
│   ├── middleware/      auth.js (JWT + role guard)
│   ├── models/           7 Mongoose models (User, Donation, Report, Notification, Pet, Food, Activity)
│   ├── routes/            9 route files (auth, users, donations, reports, notifications, pets, foods, leaderboard, funds)
│   ├── seed/               seedAdmin.js (creates the fixed admin + sample pets/food)
│   ├── mysql_schema.sql    companion relational schema
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── index.html           app shell + role-based nav bar
    ├── css/style.css        light theme
    ├── js/app.js             module + ngRoute config + route guard
    ├── js/services.js        AuthService (service) + DataFactory & ValidationFactory (factories)
    ├── js/filters.js         4 custom filters
    ├── js/directives.js      4 custom directives
    ├── js/controllers/       13 page controllers
    └── partials/              13 page templates
```

---

## 2. How to Run

### Backend
```bash
cd backend
npm install
cp .env.example .env          # edit if your Mongo/MySQL settings differ
# Make sure MongoDB is running locally (or update MONGO_URI to Atlas)
npm run seed                  # creates the fixed admin account + sample pets/food
npm start                     # runs on http://localhost:5000
```

### MongoDB Compass
Open MongoDB Compass and connect with the same URI from `.env`
(`mongodb://127.0.0.1:27017/rescueConnectDB`). You will see these collections
appear as the app is used: `users`, `donations`, `reports`, `notifications`,
`pets`, `foods`, `activities`.

### MySQL (optional, powers one admin report)
```bash
mysql -u root -p < backend/mysql_schema.sql
```

### Frontend
No build step needed (plain AngularJS 1.x + CDN libs). Just open
`frontend/index.html` via a local static server, e.g.:
```bash
cd frontend
npx serve .
```
(Opening the HTML file directly also works, but a local server avoids any
browser file:// CORS quirks.)

### Login
- **Admin:** `admin@rescueconnect` / `rescueconnect@123` (seeded automatically, fixed — cannot be created via Registration)
- **Volunteer:** Register first on the Registration page, then log in with those credentials.

---

## 3. The 13 Pages — What's on Each & Which Components Power It

| # | Page | Route | What it does | AngularJS pieces used | MongoDB collections used (min 3 each, incl. shared) |
|---|------|-------|---------------|------------------------|-------------------------------------------------------|
| 1 | **Splash Screen** | `/splash` | Animated welcome screen, auto-redirects to login | Controller `SplashCtrl`, **ngAnimate** CSS transition classes (`.splash-fade`), `$timeout` | *(none — static)* |
| 2 | **Admin Login** | `/admin-login` | Fixed single admin account login | Controller `LoginCtrl`, Service `AuthService`, data-binding (`ng-model` on credentials) | `users` |
| 3 | **Volunteer Login** | `/volunteer-login` | Only accounts created via Registration can log in | Same `LoginCtrl` + `AuthService` | `users` |
| 4 | **Registration** | `/register` | Full validation for firstname(≥3), lastname, phone, email, password(≥8, alphanumeric), age(18–60), gender, place — every field has a placeholder | Controller `RegisterCtrl`, Factory `ValidationFactory`, Directive `rc-password-strength`, two-way data-binding | `users` |
| 5 | **Dashboard** | `/dashboard` | Role-based: Admin sees org stats; Volunteer sees personal score + nearby reports | Controller `DashboardCtrl`, Factory `DataFactory`, `ng-if` role branching | `users`, `donations`, `reports` |
| 6 | **Donation** | `/donation` | amount, name, phone, UPI/GPay, age, OTP-style verification, Donate button | Controller `DonationCtrl`, Factory `DataFactory`, Filter `inr` | `donations`, `users`, `activities` |
| 7 | **Report** | `/report` | Description, photo upload, place found, animal type, how found | Controller `ReportCtrl`, Directive `rc-image-preview` (custom directive) | `reports`, `notifications`, `activities` |
| 8 | **Volunteers** | `/volunteers` | Searchable/filterable list of volunteers by name/place | Controller `VolunteerCtrl`, Filter `volunteerSearch` (custom filter), data-binding on search box | `users` |
| 9 | **Leaderboard** | `/leaderboard` | Visual ranking of volunteers by rescue-activity score | Controller `LeaderboardCtrl`, Directive `rc-score-bar` (custom directive), Filter `rankBadge` | `users`, `activities` |
| 10 | **Notifications** | `/notifications` | Messages generated automatically when a Report is submitted near a volunteer's place | Controller `NotificationCtrl`, Filter `timeAgo` | `notifications`, `reports`, `users` |
| 11 | **Pet Booking** | `/pets` | Pets ready for adoption, image + availability + age + food details | Controller `PetCtrl`, Directive `rc-status-pill`, Directive `rc-image-preview` | `pets`, `foods`, `users` |
| 12 | **Food Details** | `/food` | Which animal needs which food, quantity & frequency | Controller `FoodCtrl` | `foods`, `pets` |
| 13 | **Fund Received** (Admin only) | `/funds` | Who donated, how much, plus full list of all registered volunteers/admin; also queries the companion **MySQL** database for a relational payment-method report | Controller `FundCtrl`, Factory `DataFactory`, Filter `inr`, route-guard restricting to `role==='admin'` | `donations`, `users` **+ MySQL**: `fund_transactions`, `users`, `animal_reports` |

**Common building blocks used across all 13 pages:**
- **Service** → `AuthService` (login/session/logout, role checks) — used in `app.js` route guard and every controller that needs the current user.
- **Factory** → `DataFactory` (generic authenticated `$http` GET/POST/PUT wrapper) and `ValidationFactory` (registration validators) — used by nearly every controller.
- **Controller** → one dedicated controller per page (13 total, listed in the table).
- **Filter** → `volunteerSearch`, `inr`, `rankBadge`, `timeAgo` (4 custom filters).
- **Custom Directive** → `rc-password-strength`, `rc-image-preview`, `rc-score-bar`, `rc-status-pill` (4 custom directives).
- **Data binding** → two-way (`ng-model`) throughout forms (Registration, Donation, Report, Pet/Food add-forms) and one-way (`{{ }}` interpolation) throughout all display tables/cards.
- **Animation** → `ngAnimate` module drives the Splash screen fade/slide-in, the `ng-view` route-change transition (`.view-animate.ng-enter`), and the `.fade-slide-in` entrance animation reused on every page.

---

## 4. Role-Based Access

- **Volunteer & Admin** both get: Dashboard, Donation, Report, Volunteers, Leaderboard, Notifications, Pet Booking, Food Details.
- **Admin only**: Fund Received page (enforced both in the Angular route guard in `app.js` and server-side via the `adminOnly` middleware on `/api/funds/*`).
- Only accounts created through **Registration** (`role: 'volunteer'`) can use Volunteer Login. The **Admin** account is a single fixed, seeded account (`admin@rescueconnect` / `rescueconnect@123`) and is never created through public registration.

---

## 5. Databases — Why Both Mongo & MySQL

- **MongoDB (primary, via Mongoose)** — all 13 pages read/write here. Connect MongoDB Compass to the same `MONGO_URI` to inspect every collection live while the app runs.
- **MySQL (companion, via `mysql2`)** — a lightweight relational mirror (`users`, `fund_transactions`, `animal_reports`) used specifically to demonstrate a real SQL integration on the **Fund Received** admin page (`GET /api/funds/mysql-report` runs a `GROUP BY` aggregate query). Run `backend/mysql_schema.sql` once to create it; the app works fine without it (that one report block just shows a friendly warning if MySQL isn't running).

## 6. Donation Verification — How It Works (custom design)

1. User fills the Donation form and clicks **Donate Now** → `POST /api/donations/initiate` creates an unverified `donations` document and returns a generated 6-digit OTP + transaction reference (in production this would be pushed via the UPI/GPay app instead of being returned in the response).
2. User enters that OTP on the same page → `POST /api/donations/verify` checks it, flips `verified: true`, and (if a volunteer is logged in) logs a `Donation Facilitated` activity that adds points to their leaderboard score.
3. Only **verified** donations appear on the admin Fund Received page and count toward totals.
