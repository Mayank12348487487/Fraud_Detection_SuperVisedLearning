# 🛡️ Fraud Detection System

A full-stack real-time financial transaction fraud detection application powered by a **Machine Learning model**, a **FastAPI** backend, and a **React (Vite)** frontend with an animated, responsive UI.

---

## 📁 Project Structure

```
Fraud_Detection/
├── main.py                  # FastAPI backend — prediction API
├── fraud_model.pkl          # Pre-trained ML model (scikit-learn / joblib)
├── requirements.txt         # Python dependencies
├── venv/                    # Python virtual environment
└── frontend/                # React + Vite frontend
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx            # Root component — state & layout
        ├── App.css            # Global app styles
        ├── index.css          # CSS design tokens & utilities
        └── components/
            ├── Header.jsx             # App title / branding bar
            ├── Header.module.css
            ├── TransactionForm.jsx    # Input form (all transaction fields)
            ├── TransactionForm.module.css
            ├── ResultCard.jsx         # Animated fraud/safe result display
            ├── ResultCard.module.css
            ├── HistoryPanel.jsx       # Recent transactions sidebar
            ├── HistoryPanel.module.css
            ├── StatsBar.jsx           # Live stats (total / fraud / safe)
            ├── StatsBar.module.css
            └── ParticleField.jsx      # Animated canvas background
```

---

## 🚀 Features

- **Real-time fraud scoring** — each transaction is scored 0–100%
- **Engineered features** computed server-side (`amount_log`, `balance_error`)
- **Animated UI** with particle background, Framer Motion transitions, scan-line overlay
- **Transaction history** panel with the last 20 checks
- **Live stats bar** showing total checked, fraud flagged, and safe counts
- **Custom fraud threshold** (default 10%) displayed in the result card

---

## 🧠 ML Model & Feature Engineering

The model (`fraud_model.pkl`) was trained on financial transaction data (similar to the PaySim dataset). It expects **12 features** in the following order:

| # | Feature | Source |
|---|---------|--------|
| 1 | `step` | User input |
| 2 | `amount` | User input |
| 3 | `oldbalanceOrg` | User input |
| 4 | `newbalanceOrig` | User input |
| 5 | `oldbalanceDest` | User input |
| 6 | `newbalanceDest` | User input |
| 7 | `balance_error` | **Computed** → `oldbalanceOrg − amount − newbalanceOrig` |
| 8 | `amount_log` | **Computed** → `log1p(amount)` |
| 9 | `type_PAYMENT` | User input (0 or 1) |
| 10 | `type_TRANSFER` | User input (0 or 1) |
| 11 | `type_CASH_OUT` | User input (0 or 1) |
| 12 | `type_DEBIT` | User input (0 or 1) |

> **Note:** `balance_error` and `amount_log` are calculated internally by the backend — the frontend does **not** need to send them.

The fraud threshold is set to **10%** (`FRAUD_THRESHOLD = 0.1`). Any transaction with a predicted fraud probability ≥ 10% is flagged as fraud.

---

## 🔧 Backend — FastAPI

### Setup

```bash
# 1. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the API server
uvicorn main:app --reload
```

The API will be available at **http://127.0.0.1:8000**

### API Endpoints

#### `GET /`
Health check.
```json
{ "message": "Fraud Detection API Running" }
```

#### `POST /predict`
Analyze a transaction for fraud.

**Request Body:**
```json
{
  "step": 1,
  "amount": 9000.60,
  "oldbalanceOrg": 9000.60,
  "newbalanceOrig": 0.0,
  "oldbalanceDest": 0.0,
  "newbalanceDest": 9000.60,
  "type_CASH_OUT": 1,
  "type_DEBIT": 0,
  "type_PAYMENT": 0,
  "type_TRANSFER": 0
}
```

**Response:**
```json
{
  "isFraud": 1,
  "fraudScore": 87.34,
  "threshold": 10.0
}
```

| Field | Type | Description |
|-------|------|-------------|
| `isFraud` | `0` or `1` | Whether the transaction is flagged as fraud |
| `fraudScore` | `float` | Fraud probability as a percentage (0–100) |
| `threshold` | `float` | The decision threshold used (default: 10.0) |

---

## 💻 Frontend — React + Vite

### Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend dev server runs at **http://localhost:5173** and proxies `/api` requests to the FastAPI backend at port 8000 (configured in `vite.config.js`).

### Key Libraries

| Library | Purpose |
|---------|---------|
| `react` `react-dom` | UI framework |
| `framer-motion` | Smooth animations & transitions |
| `react-icons` | Icon library |
| `recharts` | Charts / data visualization |
| `axios` | HTTP client |
| `vite` | Build tool & dev server |

### Components

| Component | Description |
|-----------|-------------|
| `App.jsx` | Root component — manages global state (result, history, loading, error) |
| `Header.jsx` | Top branding bar with app name |
| `TransactionForm.jsx` | Form with all 10 user-input fields including transaction type selector |
| `ResultCard.jsx` | Displays fraud score with animated gauge and verdict badge |
| `HistoryPanel.jsx` | Scrollable list of the last 20 analyzed transactions |
| `StatsBar.jsx` | Summary bar: total checked, fraud count, safe count |
| `ParticleField.jsx` | Animated canvas particle background effect |

---

## 📦 Python Dependencies (`requirements.txt`)

Key packages include:

- `fastapi` — Web framework for the API
- `uvicorn` — ASGI server
- `scikit-learn` — ML model (used during training & inference)
- `joblib` — Model serialization/deserialization
- `numpy` — Numerical operations for feature engineering
- `pydantic` — Request body validation

---

## ▶️ Running the Full Application

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd Fraud_Detection
venv\Scripts\activate
uvicorn main:app --reload
```

**Terminal 2 — Frontend:**
```bash
cd Fraud_Detection\frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 📊 How It Works (Data Flow)

```
User fills TransactionForm
        │
        ▼
Frontend POSTs to /api/predict
        │
        ▼ (Vite proxy)
FastAPI /predict endpoint
        │
        ├─ Computes balance_error = oldbalanceOrg − amount − newbalanceOrig
        ├─ Computes amount_log    = log1p(amount)
        ├─ Builds 12-feature vector
        └─ Calls model.predict_proba()
        │
        ▼
Returns { isFraud, fraudScore, threshold }
        │
        ▼
ResultCard displays verdict + animated score
HistoryPanel & StatsBar update
```

---

## 📝 Notes

- Only **one transaction type** should be set to `1` at a time (`type_CASH_OUT`, `type_TRANSFER`, `type_PAYMENT`, or `type_DEBIT`). The rest must be `0`.
- The `fraud_model.pkl` file is required to run the backend. It is not re-trainable from this repo without the original training dataset.
- The fraud threshold of **10%** is intentionally low to compensate for class imbalance in fraud datasets (~1% fraud rate in real-world data).
