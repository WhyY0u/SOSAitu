import type { TicketType } from '@/domain/entities/ticket/Ticket';
import styles from './style/Style.module.css'

interface InfoComponentProps {
    fullname: string,
    category: TicketType,
    decided: number,
    at_work: number,
    average_time: string;
    status: string;
}

const InfoComponent = ({ fullname, category, decided, at_work, average_time, status }: InfoComponentProps) => {
    return <>
        <div className={`${styles.container_info}`}>
            <p className={`${styles.text}`}>{fullname}</p>
            <p className={`${styles.text}`}>{category}</p>
            <p className={`${styles.text}`}>{decided}</p>
            <p className={`${styles.text}`}>{at_work}</p>
            <p className={`${styles.text}`}>{average_time}</p>
            <p className={`${styles.text}`}>{status}</p>
        </div>
    </>
}

export default InfoComponent;