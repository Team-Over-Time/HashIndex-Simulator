# Hash Index Simulator (HashLab)

An interactive DBMS Hash Index Simulator with an Express backend and React + Vite frontend.

---

## 🚀 How to Run in VS Code

### Option 1: One Command in the Terminal (Recommended)
1. Open the project in VS Code (`File > Open Folder...`).
2. Open the built-in terminal (`Ctrl + ~` or `Terminal > New Terminal`).
3. Run:
   ```bash
   npm run dev
   ```
   *(This starts both the **Backend API Server** on `http://localhost:5000` and the **Frontend Client** on `http://localhost:5173` simultaneously!)*
4. Open your browser and go to:
   👉 **http://localhost:5173**

---

### Option 2: Using VS Code Run / Build Task (Keyboard Shortcut)
1. Press `Ctrl + Shift + B` in VS Code.
2. Select **"Start Simulator (Backend + Frontend)"**.
3. It will launch the servers in an integrated terminal tab.

---

### Option 3: Using VS Code "Run and Debug" (F5)
1. Press `F5` or switch to the **Run & Debug** panel on the left sidebar (`Ctrl + Shift + D`).
2. Select **"Start Simulator & Open Browser (Edge)"** or **"Chrome"**.
3. Click the green Play button. It will start the server & client and launch the browser automatically.

---

### Option 4: Running in Separate Terminals (Manual)
If you prefer to run the backend and frontend separately:

- **Terminal 1 (Backend Server):**
  ```bash
  npm run server
  ```
  *(Runs Express API on `http://localhost:5000`)*

- **Terminal 2 (Frontend Client):**
  ```bash
  npm run client
  ```
  *(Runs Vite React App on `http://localhost:5173`)*

---

## 🛠️ Project Structure

```
hashIndexSimulator/
├── client/              # React (Vite) Single Page Application
│   ├── src/             # Simulation visualizations, charts, controls
│   └── package.json
├── server/              # Express.js REST API
│   ├── routes/          # Hash simulation routes (/api/simulate, /api/compare)
│   ├── controllers/     # Hashing logic & bucket operations
│   └── server.js
├── .vscode/             # VS Code tasks & launch configurations
├── package.json         # Workspace scripts & dev tools
└── README.md
```

## 🌐 Endpoints & URLs
- **Web Interface:** (https://hash-index-simulator.vercel.app/)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Algorithms API:** [http://localhost:5000/api/algorithms](http://localhost:5000/api/algorithms)
