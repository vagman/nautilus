# 🌦️ Nautilus: Advanced Weather & Disaster Dashboard

Nautilus is a comprehensive full-stack environmental monitoring platform. It combines real-time weather forecasting with a community-driven disaster management system, allowing users to stay safe and coordinate volunteer efforts.

---

## 🚀 Features

- **Real-time Weather:** Fetches data using OpenWeatherMap API.
- **5-Day Forecast:** Displays temperature, humidity, wind speed, and rain probability.
- **Smart Alerts:** Warnings for extreme weather conditions (heatwaves, high winds).
- **Clothing Suggestions:** Dynamic advice on what to wear (e.g., umbrella for rain, hat for sun).
- **User System:** Secure Login & Signup with JWT Authentication and Bcrypt hashing.
- **Global Theming:** Toggleable Dark/Light mode that persists to the database.
- **Interactive Map:** Visual location selection using Leaflet.
- **Responsive Sidebar:** Mobile-friendly navigation menu.

---

## 🛠️ Tech Stack

### Frontend

- Framework: React (Vite)
- Styling: Tailwind CSS + Framer Motion
- State Management: Context API
- Maps: Leaflet.js
- Internationalization: i18next
- Icons: Lucide React

### Backend

- Environment: Node.js + Express.js (ES Modules)
- Database: PostgreSQL
- File Handling: Multer (Local storage with safe-delete logic)
- Authentication: JWT & BCrypt
- Mailing: Nodemailer + Google OAuth 2.0
- Security: Express Rate Limit & CORS

---

## ⚙️ Getting Started

### 🖥️ 1. Clone the Repo

```shell
git clone https://github.com/vagman/nautilus.git
cd nautilus
```

### 🌐 2. Frontend Setup

```shell
npm install          # Install dependencies
npm run dev          # Start frontend server (http://localhost:5173)
```

You must create a `.env` file in the root project directory:

```shell
VITE_WEATHER_API_KEY=your_openweathermap_api_key
```

### 🔧 3. Backend Setup

```shell
cd weather-app-backend
npm install
npm run dev
```

Create a `.env` file inside the weather-app-backend/ folder:

```shell
PORT=4000
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=weather_app
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_super_secret_key
```

🗃️ Database (PostgreSQL)

1. Make sure PostgreSQL 14 or higher is installed and pgAdmin (or via cli) is runnung.
2. Create database:
   ```sql
   CREATE DATABASE weather_app;
   ```
3. Create all the needed database tables by running the PostgreSQL code that lives in `\nautilus\weather-app-backend\schema.sql`.
4. Test the backend DB connection:
   ```shell
   curl http://localhost:4000/test-db
   ```
   The following message should confirm connection with the database:
   <img width="557" height="99" alt="image" src="https://github.com/user-attachments/assets/7eccd7cc-abfd-42a5-aa1a-88a754a8eb20" />

### 🧪 Useful Commands

| Task                      | Command                                 |
| ------------------------- | --------------------------------------- |
| Start Frontend            | `npm run dev (in project root)`         |
| Start Backend             | `cd weather-app-backend && npm run dev` |
| Build Frontend            | `npm run build`                         |
| Install Frontend Packages | `npm install`                           |
| Install Backend Packages  | `cd weather-app-backend && npm install` |
| Test DB Connection        | `curl http://localhost:4000/test-db`    |

### 📝 Notes

- You must have Node.js 18+ and PostgreSQL 14+ installed
- File Extensions: Backend uses standard `.js` files with `"type": "module"` in `package.json`.
- Make sure your OpenWeatherMap API key is valid
- Security: Passwords are never stored in plain text; they are hashed using `bcryptjs`.

### 📌 Project Status & Roadmap

## ✅ Completed Milestones

### **Core & Infrastructure**

- [x] **Core Features:** Fetch and display weather data & extreme condition alerts.
- [x] **Authentication:** Secure Login/Signup with Password Hashing & JWT.
- [x] **Secure Email System:** Integrated **Google OAuth 2.0** with Nodemailer for secure delivery of system emails.
- [x] **Theming:** Global Dark/Light mode with Database persistence & UI Sync.
- [x] **Navigation:** Responsive Sidebar with "Settings" menu & Language toggles.
- [x] **Architecture:** Modular Backend Routes (`/api/auth`, `/api/users`, etc.) & Centralized Frontend API.
- [x] **Database:** Standardized PostgreSQL schema with synchronized user preferences.

### **Phase 1: UI/UX Refinement**

- [x] **Profile Management:** Users can update details and upload profile pictures (Base64).
- [x] **UI Polish:** Responsive layouts, loading states, and consistent card designs.

### **Phase 2: Community & Content**

- [x] **Volunteer Page:** A dedicated hub for creating and viewing disaster relief events.
- [x] **About Section:** Integrated into Settings for easy access to version/mission info.

### **Phase 3: Administration & Security (RBAC)**

- [x] **Role-Based Access Control (RBAC):** Database support for `Admin` vs `User` roles.
- [x] **Admin Reporting:** Interactive map interface for admins to publish new disaster alerts.
- [x] **Admin Controls:** Conditional rendering of "Create Event" and "Manage Reports" buttons.
- [x] **Password Recovery:** Full "Forgot Password" flow with secure email links and token validation.
- [x] **Brute-Force Protection:** Implemented Rate Limiting (express-rate-limit) on login/signup endpoints.

## 🛠️ Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Leaflet Maps, Framer Motion (animations), Lucide React (icons), i18next (translation).
- **Backend:** Node.js, Express, PostgreSQL, Nodemailer (OAuth 2.0).
- **Security:** BCrypt, JWT, Express Rate Limit.

## 🔮 Coming Soon / Next Steps

- [ ] **Push Notifications:** Browser notifications for high-severity alerts in the user's radius.
- [ ] **Chat System:** Real-time chat for volunteer event coordination.
- [ ] **Advanced Filtering:** Filter disasters by type (Fire, Flood, Earthquake).

📄 License
This project is open source and available under the MIT License.
