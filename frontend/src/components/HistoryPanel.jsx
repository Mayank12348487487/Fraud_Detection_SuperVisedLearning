import { motion } from 'framer-motion'
import { FiClock, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'
import styles from './HistoryPanel.module.css'

export default function HistoryPanel({ history }) {
    if (history.length === 0) return null

    return (
        <motion.div
            className={`${styles.panel} glass`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            <div className={styles.panelHeader}>
                <FiClock className={styles.panelIcon} />
                <h3 className={styles.panelTitle}>Recent Transactions</h3>
                <span className={styles.count}>{history.length}</span>
            </div>

            <ul className={styles.list}>
                {history.map((item, i) => (
                    <motion.li
                        key={item.id}
                        className={`${styles.item} ${item.isFraud ? styles.itemFraud : styles.itemSafe}`}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                    >
                        <span className={styles.itemIcon}>
                            {item.isFraud
                                ? <FiAlertTriangle className={styles.iconFraud} />
                                : <FiCheckCircle className={styles.iconSafe} />
                            }
                        </span>
                        <div className={styles.itemInfo}>
                            <span className={styles.itemType}>{item.type}</span>
                            <span className={styles.itemAmount}>${Number(item.amount).toLocaleString()}</span>
                        </div>
                        <div className={styles.itemRight}>
                            <span className={`${styles.badge} ${item.isFraud ? styles.badgeFraud : styles.badgeSafe}`}>
                                {item.isFraud ? 'FRAUD' : 'SAFE'}
                            </span>
                            <span className={styles.time}>{item.timestamp}</span>
                        </div>
                    </motion.li>
                ))}
            </ul>
        </motion.div>
    )
}
