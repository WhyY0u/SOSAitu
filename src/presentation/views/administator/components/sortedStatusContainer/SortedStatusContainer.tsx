import { TicketStatus } from '@/domain/entities/ticket/Ticket';
import styles from './style/Style.module.css'


export type TicketStatusFilter = TicketStatus | "Все";

interface SortedStatusContainerProps {
    all: number;
    newCount: number;
    inProgress: number;
    closed: number;
    onSelect: (value: TicketStatusFilter) => void;
    selected: TicketStatusFilter;
}


const SortedStatusContainer = ({ all, newCount, inProgress, closed, selected, onSelect }: SortedStatusContainerProps) => {


    return (
        <div className={`${styles.sorted_status_container}`}>
            <p onClick={() => onSelect('Все')} className={`${styles.text}  ${selected == 'Все' ? styles.text_selected : ''}`}>Все <span className={`${styles.circle} ${selected == 'Все' ? styles.circle_selected : ''}`}>{all}</span></p>
            <p onClick={() => onSelect(TicketStatus.Expectation)} className={`${styles.text} ${selected == TicketStatus.Expectation ? styles.text_selected : ''}`}>Новые <span className={`${styles.circle} ${selected == TicketStatus.Expectation ? styles.circle_selected : ''}`}>{newCount}</span></p>
            <p onClick={() => onSelect(TicketStatus.InProgress)} className={`${styles.text} ${selected == TicketStatus.InProgress ? styles.text_selected : ''}`}>В работе <span className={`${styles.circle} ${selected == TicketStatus.InProgress ? styles.circle_selected : ''}`}>{inProgress}</span></p>
            <p onClick={() => onSelect(TicketStatus.Completed)} className={`${styles.text} ${selected == TicketStatus.Completed ? styles.text_selected : ''}`}>Закрытые <span className={`${styles.circle} ${selected == TicketStatus.Completed ? styles.circle_selected : ''}`}>{closed}</span></p>
        </div>
    );
};

export default SortedStatusContainer;
