import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import TransactionForm from './components/TransactionForm'
import ResultCard from './components/ResultCard'
import HistoryPanel from './components/HistoryPanel'
import ParticleField from './components/ParticleField'
import StatsBar from './components/StatsBar'
import './App.css'

function App() {
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [history, setHistory] = useState([])
    const [error, setError] = useState(null)

    const handlePredict = useCallback(async (formData) => {
        setLoading(true)
        setError(null)
        setResult(null)
        try {
            const res = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            if (!res.ok) throw new Error(`Server error: ${res.status}`)
            const data = await res.json()
            setResult(data)
            setHistory(prev => [
                {
                    id: Date.now(),
                    amount: formData.amount,
                    type: formData.type_TRANSFER
                        ? 'TRANSFER' : formData.type_CASH_OUT
                            ? 'CASH_OUT' : formData.type_PAYMENT
                                ? 'PAYMENT' : 'DEBIT',
                    isFraud: data.isFraud,
                    timestamp: new Date().toLocaleTimeString(),
                },
                ...prev.slice(0, 19),
            ])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    const totalChecked = history.length
    const fraudCount = history.filter(h => h.isFraud).length
    const safeCount = totalChecked - fraudCount

    return (
        <div className="app-shell">
            {/* Background layers */}
            <div className="animated-bg" />
            <div className="scan-lines" />
            <ParticleField />

            {/* Content */}
            <div className="app-content">
                <Header />

                <StatsBar total={totalChecked} fraud={fraudCount} safe={safeCount} />

                <main className="main-grid">
                    {/* Left: Form */}
                    <section className="form-section">
                        <TransactionForm onSubmit={handlePredict} loading={loading} />
                        {error && (
                            <div className="error-banner">
                                <span>⚠ {error}</span>
                            </div>
                        )}
                    </section>

                    {/* Right: Result + History */}
                    <section className="results-section">
                        <AnimatePresence mode="wait">
                            {result !== null && !loading && (
                                <ResultCard key={result.isFraud + '_' + Date.now()} result={result} />
                            )}
                        </AnimatePresence>

                        {loading && <LoadingSpinner />}

                        {!loading && result === null && <IdlePrompt />}

                        <HistoryPanel history={history} />
                    </section>
                </main>
            </div>
        </div>
    )
}

function LoadingSpinner() {
    return (
        <div className="idle-box">
            <div className="spinner-ring" />
            <p style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Analyzing transaction…</p>
        </div>
    )
}

function IdlePrompt() {
    return (
        <div className="idle-box">
            <div className="idle-icon">🛡</div>
            <p className="idle-title">Ready to Analyze</p>
            <p className="idle-sub">Fill in the transaction details and hit <strong>Analyze Transaction</strong></p>
        </div>
    )
}

export default App
