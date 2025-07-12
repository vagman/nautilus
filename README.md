# 🌦️ Weather Alert App

A weather-based web application that fetches weather forecasts and provides alerts for extreme weather conditions. It also suggests appropriate clothing or accessories based on the forecast.

---

## 🚀 Features

- Fetches real-time weather forecasts using the OpenWeatherMap API
- Displays 5-day forecasts with temperature, humidity, wind, etc.
- Alerts for extreme weather conditions
- Clothing/accessory suggestions (e.g., umbrella for rain)
- User login & signup system (in progress)
- PostgreSQL database for user management

---

## 🛠️ Technologies Used

- **Frontend**: React + Vite
- **Backend**: Express.js (with ES Modules)
- **Database**: PostgreSQL
- **Auth**: JWT (JSON Web Tokens)
- **Styling**: CSS

---

## ⚙️ Getting Started

### 🖥️ 1. Clone the Repo

```bash
git clone https://github.com/yourusername/weather-alert-app.git
cd weather-alert-app
```

### 🌐 2. Frontend Setup

```
npm install          # Install dependencies
npm run dev          # Start frontend server (http://localhost:5173)
```

You must create a .env file in the root project directory:

```
VITE_WEATHER_API_KEY=your_openweathermap_api_key
```

### 🔧 3. Backend Setup

```
cd weather-app-backend
npm install
node --experimental-modules index.mjs # Start backend server (http://localhost:4000)
```

Create a .env file inside the weather-app-backend/ folder:

```
PORT=4000
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=weather_app
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_super_secret_key
```

🗃️ Database (PostgreSQL)
Make sure PostgreSQL 14 or higher is installed and running.

#### Create database:

```sql
CREATE DATABASE weather_app;
```

Test the backend DB connection:

```shell
curl http://localhost:4000/test-db
```

### 🧪 Useful Commands

| Task                      | Command                               |
| ------------------------- | ------------------------------------- |
| Start Frontend            | npm run dev (in project root)         |
| Start Backend             | node --experimental-modules index.mjs |
| Build Frontend            | npm run build                         |
| Install Frontend Packages | npm install                           |
| Install Backend Packages  | cd weather-app-backend && npm install |
| Test DB Connection        | curl http://localhost:4000/test-db    |

### 📝 Notes

- You must have Node.js 18+ and PostgreSQL 14+ installed
- The app uses ES modules, not CommonJS (require)
- Make sure the OpenWeatherMap API key is valid

### 📌 Todo

- [x] Fetch and display weather
- [x] Add alerts for extreme conditions
- [ ] Implement login/signup (in progress)
- [ ] Add user dashboard
- [ ] Mobile responsiveness

📄 License
This project is open source and available under the MIT License.
