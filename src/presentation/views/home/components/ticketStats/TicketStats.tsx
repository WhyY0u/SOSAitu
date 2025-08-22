import type { ReactNode } from "react";
import styles from "./styles/Style.module.css";

interface TicketStatsProps {
    icon: ReactNode;
    label: string;
    count: number;
}

const TicketStats = ({ icon, label, count }: TicketStatsProps) => {
    return (
        <div className={styles.ticketStat}>
            <div className={styles.topRow}>
                <div className={styles.iconWrapper}>{icon}</div>
                <p className={styles.count}>{count}</p>
            </div>
            <p className={styles.label}>{label}</p>
        </div>
    );
};


export default TicketStats;
