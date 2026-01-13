# 🌦️ Weather Alert App

A weather-based web application that fetches weather forecasts and provides alerts for extreme weather conditions. It also suggests appropriate clothing or accessories based on the forecast.

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

## 🛠️ Technologies Used

- **Frontend**: React (Vite), Context API, CSS Modules, Leaflet
- **Backend**: Node.js + Express.js (ES Modules)
- **Database**: PostgreSQL
- **Auth**: JWT (JSON Web Tokens)
- **Styling**: CSS

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

You must create a .env file in the root project directory:

```shell
VITE_WEATHER_API_KEY=your_openweathermap_api_key
```

### 🔧 3. Backend Setup

```shell
cd weather-app-backend
npm install
npm run dev
```

Create a .env file inside the weather-app-backend/ folder:

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

| Task                      | Command                                                    |
| ------------------------- | ---------------------------------------------------------- |
| Start Frontend            | `npm run dev (in project root)`                            |
| Start Backend             | `cd weather-app-backend && npm run dev` OR `node index.js` |
| Build Frontend            | `npm run build`                                            |
| Install Frontend Packages | `npm install`                                              |
| Install Backend Packages  | `cd weather-app-backend && npm install`                    |
| Test DB Connection        | `curl http://localhost:4000/test-db`                       |

### 📝 Notes

- You must have Node.js 18+ and PostgreSQL 14+ installed
- File Extensions: Backend uses standard `.js` files with `"type": "module"` in `package.json`.
- Make sure your OpenWeatherMap API key is valid
- Security: Passwords are never stored in plain text; they are hashed using `bcryptjs`.

### 📌 Project Status & Roadmap

✅ Completed Milestones

- [x] Fetch and display weather data
- [x] Add alerts for extreme conditions
- [x] Implement Login/Signup system
- [x] Secure Password Hashing & JWT Auth
- [x] Global Theming: Dark/Light mode with Database persistence
- [x] Navigation: Responsive Sidebar with "Settings" menu

🚧 Phase 1: Architecture Refactoring (The "Pro" Upgrade)

- [ ] File Structure: Move generic components (AuthForm, Map) into their own folders.
- [ ] Clean Imports: Add index.jsx files to component folders.
- [ ] CSS Modularization: Convert remaining global styles to Component.module.css.

✨ Phase 2: Feature Expansion

- [ ] Volunteer Page: Create a view for community disaster relief volunteering.
- [ ] Help & Contact: Add a support/FAQ section for users.
- [ ] About Page: Project information and mission statement.
- [ ] Sidebar Integration: Link these new pages to the existing Sidebar navigation.

📱 Phase 3: Enhancements

- [ ] User Dashboard: Save favorite locations and view search history.
- [ ] Mobile Responsiveness: Further polish for small screens.

📄 License
This project is open source and available under the MIT License.
