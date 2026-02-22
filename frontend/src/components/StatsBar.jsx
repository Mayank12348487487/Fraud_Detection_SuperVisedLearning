import { motion } from 'framer-motion'
import { FiShield, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'
import styles from './StatsBar.module.css'

export default function StatsBar({ total, fraud, safe }) {
    const fraudRate = total > 0 ? Math.round((fraud / total) * 100) : 0

    const stats = [
        {
            label: 'Total Analyzed',
            value: total,
            icon: <FiShield />,
            color: 'blue',
        },
        {
            label: 'Fraud Detected',
            value: fraud,
            icon: <FiAlertTriangle />,
            color: 'red',
        },
        {
            label: 'Safe Transactions',
            value: safe,
            icon: <FiCheckCircle />,
            color: 'green',
        },
        {
            label: 'Fraud Rate',
            value: `${fraudRate}%`,
            icon: null,
            color: fraudRate > 50 ? 'red' : fraudRate > 20 ? 'orange' : 'green',
        },
    ]

    return (
        <div className={styles.bar}>
            {stats.map((s, i) => (
                <motion.div
                    key={s.label}
                    className={`${styles.stat} ${styles[`stat_${s.color}`]}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                >
                    {s.icon && <span className={styles.statIcon}>{s.icon}</span>}
                    <div>
                        <div className={styles.statValue}>{s.value}</div>
                        <div className={styles.statLabel}>{s.label}</div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
