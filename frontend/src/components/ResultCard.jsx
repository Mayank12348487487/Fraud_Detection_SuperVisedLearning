import { motion } from 'framer-motion'
import { FiAlertTriangle, FiCheckCircle, FiDollarSign } from 'react-icons/fi'
import styles from './ResultCard.module.css'

export default function ResultCard({ result }) {
    const isFraud = result.isFraud === 1

    return (
        <motion.div
            className={`${styles.card} ${isFraud ? styles.fraudCard : styles.safeCard}`}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
            {/* Ring pulse */}
            <div className={`${styles.ring} ${isFraud ? styles.ringFraud : styles.ringSafe}`} />

            {/* Icon badge */}
            <motion.div
                className={styles.iconBadge}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 20 }}
            >
                {isFraud
                    ? <FiAlertTriangle className={styles.iconFraud} />
                    : <FiCheckCircle className={styles.iconSafe} />
                }
            </motion.div>

            {/* Verdict text */}
            <motion.h2
                className={`${styles.verdict} ${isFraud ? styles.verdictFraud : styles.verdictSafe}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
            >
                {isFraud ? '⚠ FRAUD DETECTED' : '✓ TRANSACTION SAFE'}
            </motion.h2>

            <motion.p
                className={styles.desc}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
            >
                {isFraud
                    ? 'This transaction has been flagged as potentially fraudulent. Immediate review recommended.'
                    : 'This transaction appears legitimate based on our AI analysis. No anomalies detected.'
                }
            </motion.p>

            {/* Score bar */}
            <motion.div
                className={styles.scoreBar}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                style={{ transformOrigin: 'left' }}
            >
                <div className={styles.scoreLabel}>
                    <FiDollarSign style={{ marginRight: 4 }} />
                    Fraud Probability
                </div>
                <div className={styles.barTrack}>
                    <motion.div
                        className={`${styles.barFill} ${isFraud ? styles.barFillFraud : styles.barFillSafe}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.fraudScore ?? (isFraud ? 85 : 5)}%` }}
                        transition={{ delay: 0.55, duration: 0.7, ease: 'easeOut' }}
                    />
                </div>
                <span className={`${styles.barPct} ${isFraud ? styles.pctFraud : styles.pctSafe}`}>
                    {result.fraudScore != null ? `${result.fraudScore}%` : (isFraud ? 'HIGH' : 'LOW')}
                </span>
            </motion.div>

            {/* Raw value */}
            <div className={styles.raw}>
                Model score: <code>{result.fraudScore != null ? `${result.fraudScore}%` : result.isFraud}</code>
                {result.threshold != null && <> &nbsp;·&nbsp; Threshold: <code>{result.threshold}%</code></>}
            </div>
        </motion.div>
    )
}
