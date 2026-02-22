from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
from pydantic import BaseModel

app = FastAPI(title="Fraud Detection API")

# CORS — allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
model = joblib.load("fraud_model.pkl")

@app.get("/")
def home():
    return {"message": "Fraud Detection API Running"}

class Transaction(BaseModel):
    step: int
    amount: float
    oldbalanceOrg: float
    newbalanceOrig: float
    oldbalanceDest: float
    newbalanceDest: float

    # Dummy columns (example — MUST MATCH TRAINING)
    type_CASH_OUT: int
    type_DEBIT: int
    type_PAYMENT: int
    type_TRANSFER: int

@app.post("/predict")
def predict(tx: Transaction):

    # ✅ Compute engineered features internally
    amount_log = np.log1p(tx.amount)
    balance_error = tx.oldbalanceOrg - tx.amount - tx.newbalanceOrig

    # ✅ Build FULL feature vector
    features = np.array([[
        tx.step,
        tx.amount,
        tx.oldbalanceOrg,
        tx.newbalanceOrig,
        tx.oldbalanceDest,
        tx.newbalanceDest,

        balance_error,   # MUST MATCH TRAINING ORDER 🚨
        amount_log,      # MUST MATCH TRAINING ORDER 🚨

        tx.type_PAYMENT,
        tx.type_TRANSFER,
        tx.type_CASH_OUT,
        tx.type_DEBIT
    ]])

    # Use predict_proba instead of predict to get the fraud probability.
    # Fraud datasets are heavily imbalanced (~1% fraud), so the default 0.5
    # threshold is far too high — the model almost never crosses it.
    # A threshold of 0.3 is a common starting point for fraud detection.
    FRAUD_THRESHOLD = 0.1

    if hasattr(model, "predict_proba"):
        fraud_prob = float(model.predict_proba(features)[0][1])
    else:
        # Fallback for models without probability support
        fraud_prob = float(model.predict(features)[0])

    is_fraud = int(fraud_prob >= FRAUD_THRESHOLD)

    return {
        "isFraud": is_fraud,
        "fraudScore": round(fraud_prob * 100, 2),   # 0–100 %
        "threshold": FRAUD_THRESHOLD * 100,          # so UI can display it
    }