import styles from './Header.module.css'
import { FiShield, FiActivity } from 'react-icons/fi'

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.brand}>
                <div className={styles.logoBox}>
                    <FiShield className={styles.logoIcon} />
                    <div className={styles.logoPulse} />
                </div>
                <div>
                    <h1 className={styles.title}>
                        Fraud<span className={styles.titleAccent}>Shield</span>
                        <span className={styles.titleAI}> AI</span>
                    </h1>
                    <p className={styles.tagline}>Real-Time Transaction Intelligence</p>
                </div>
            </div>

            <div className={styles.statusBadge}>
                <FiActivity className={styles.activityIcon} />
                <span>Model Live</span>
                <div className={styles.liveDot} />
            </div>
        </header>
    )
}
