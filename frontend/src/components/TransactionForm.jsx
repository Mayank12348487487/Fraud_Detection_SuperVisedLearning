import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    FiDollarSign, FiHash, FiArrowRight, FiTrendingUp, FiTrendingDown, FiCpu
} from 'react-icons/fi'
import styles from './TransactionForm.module.css'

const TRANSACTION_TYPES = [
    { label: 'Cash Out', value: 'CASH_OUT', icon: '💸' },
    { label: 'Transfer', value: 'TRANSFER', icon: '🔄' },
    { label: 'Payment', value: 'PAYMENT', icon: '💳' },
    { label: 'Debit', value: 'DEBIT', icon: '🏦' },
]

const defaultForm = {
    step: '',
    amount: '',
    oldbalanceOrg: '',
    newbalanceOrig: '',
    oldbalanceDest: '',
    newbalanceDest: '',
    txType: 'CASH_OUT',
}

export default function TransactionForm({ onSubmit, loading }) {
    const [form, setForm] = useState(defaultForm)

    const set = (field) => (e) =>
        setForm(f => ({ ...f, [field]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { txType, ...rest } = form
        await onSubmit({
            step: parseInt(rest.step, 10) || 1,
            amount: parseFloat(rest.amount) || 0,
            oldbalanceOrg: parseFloat(rest.oldbalanceOrg) || 0,
            newbalanceOrig: parseFloat(rest.newbalanceOrig) || 0,
            oldbalanceDest: parseFloat(rest.oldbalanceDest) || 0,
            newbalanceDest: parseFloat(rest.newbalanceDest) || 0,
            type_CASH_OUT: txType === 'CASH_OUT' ? 1 : 0,
            type_TRANSFER: txType === 'TRANSFER' ? 1 : 0,
            type_PAYMENT: txType === 'PAYMENT' ? 1 : 0,
            type_DEBIT: txType === 'DEBIT' ? 1 : 0,
        })
        // Reset all fields after result is received
        setForm(defaultForm)
    }

    return (
        <motion.div
            className={`${styles.card} glass`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className={styles.cardHeader}>
                <FiCpu className={styles.headerIcon} />
                <div>
                    <h2 className={styles.cardTitle}>Transaction Details</h2>
                    <p className={styles.cardSub}>Enter transaction data to detect fraud</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Transaction Type Selector */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Transaction Type</label>
                    <div className={styles.typeGrid}>
                        {TRANSACTION_TYPES.map(t => (
                            <button
                                key={t.value}
                                type="button"
                                className={`${styles.typeBtn} ${form.txType === t.value ? styles.typeBtnActive : ''}`}
                                onClick={() => setForm(f => ({ ...f, txType: t.value }))}
                            >
                                <span className={styles.typeIcon}>{t.icon}</span>
                                <span>{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step */}
                <InputField
                    icon={<FiHash />}
                    label="Step (Time Unit)"
                    hint="Hour of the day the transaction happened (1 = 1st hour, 744 = end of month)"
                    id="step"
                    type="number"
                    min="1"
                    placeholder="e.g. 1  (range: 1 – 744)"
                    value={form.step}
                    onChange={set('step')}
                />

                {/* Amount */}
                <InputField
                    icon={<FiDollarSign />}
                    label="Transaction Amount ($)"
                    hint="Total money being sent / withdrawn in this transaction"
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 9000.00"
                    value={form.amount}
                    onChange={set('amount')}
                    required
                />

                {/* Balances — 2 column */}
                <div className={styles.sectionLabel}>Sender's Account Balances</div>
                <div className={styles.twoCol}>
                    <InputField
                        icon={<FiTrendingDown />}
                        label="Balance Before Transfer"
                        hint="Sender's account balance before this transaction"
                        id="oldbalanceOrg"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g. 10000"
                        value={form.oldbalanceOrg}
                        onChange={set('oldbalanceOrg')}
                    />
                    <InputField
                        icon={<FiTrendingUp />}
                        label="Balance After Transfer"
                        hint="Sender's account balance after this transaction"
                        id="newbalanceOrig"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g. 1000"
                        value={form.newbalanceOrig}
                        onChange={set('newbalanceOrig')}
                    />
                </div>

                <div className={styles.sectionLabel}>Recipient's Account Balances</div>
                <div className={styles.twoCol}>
                    <InputField
                        icon={<FiTrendingDown />}
                        label="Balance Before Receiving"
                        hint="Recipient's balance before money arrived"
                        id="oldbalanceDest"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g. 0"
                        value={form.oldbalanceDest}
                        onChange={set('oldbalanceDest')}
                    />
                    <InputField
                        icon={<FiTrendingUp />}
                        label="Balance After Receiving"
                        hint="Recipient's balance after money arrived"
                        id="newbalanceDest"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g. 9000"
                        value={form.newbalanceDest}
                        onChange={set('newbalanceDest')}
                    />
                </div>

                <motion.button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                    {loading ? (
                        <span className={styles.btnSpinner} />
                    ) : (
                        <>
                            <FiCpu /> Analyze Transaction <FiArrowRight />
                        </>
                    )}
                </motion.button>
            </form>
        </motion.div>
    )
}

function InputField({ icon, label, hint, id, ...props }) {
    return (
        <div className={styles.fieldGroup}>
            <label htmlFor={id} className={styles.label}>
                <span className={styles.labelIcon}>{icon}</span>
                {label}
            </label>
            <div className={styles.inputWrap}>
                <input id={id} {...props} />
            </div>
            {hint && <p className={styles.hint}>{hint}</p>}
        </div>
    )
}
