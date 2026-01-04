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
- **Frontend**: React + Vite + Leaflet
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
3. Create all the needed database tables by running the PostgreSQL code that lives in ```\nautilus\weather-app-backend\schema.sql```.
4. Test the backend DB connection:
      ```shell
      curl http://localhost:4000/test-db
      ```
      The following message should confirm connection with the database:
      <img width="557" height="99" alt="image" src="https://github.com/user-attachments/assets/7eccd7cc-abfd-42a5-aa1a-88a754a8eb20" />

### 🧪 Useful Commands
| Task                      | Command                                                                    |
| ------------------------- | -------------------------------------------------------------------------- |
| Start Frontend            | ```npm run dev (in project root)```                                        |
| Start Backend             | ```cd weather-app-backend && npm run dev``` OR ```node index.js```         |
| Build Frontend            | ```npm run build```                                                        |
| Install Frontend Packages | ```npm install```                                                          |
| Install Backend Packages  | ```cd weather-app-backend && npm install```                                |
| Test DB Connection        | ```curl http://localhost:4000/test-db```                                   |

### 📝 Notes
- You must have Node.js 18+ and PostgreSQL 14+ installed
- File Extensions: Backend uses standard ```.js``` files with ```"type": "module"``` in ```package.json```.
- Make sure the OpenWeatherMap API key is valid
- Security: Passwords are never stored in plain text; they are hashed using ```bcryptjs```.

### 📌 Todo
- [x] Fetch and display weather
- [x] Add alerts for extreme conditions
- [x] Implement login/signup
- [x] Secure Password Hashing & JWT Auth
- [ ] Add user dashboard (Saved locations, history)
- [ ] Mobile responsiveness improvements

📄 License
This project is open source and available under the MIT License.
