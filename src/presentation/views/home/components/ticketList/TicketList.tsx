import type { Ticket } from '@/domain/entities/ticket/Ticket';
import styles from './style/Style.module.css';
import React from 'react';
import TicketComponent from './components/TicketComponent';

interface TicketListComponentProps {
    list: Ticket[];
}

const TicketListComponent = ({ list }: TicketListComponentProps) => {
    const [tickets, setTickets] = React.useState<Ticket[]>([]);

    React.useEffect(() => {
        setTickets(list)
    }, [list]);

    return (
        <div className={styles.ticket_list_container}>
            {tickets.map(ticket => (
                <TicketComponent key={ticket.id} ticket={ticket} />
            ))}
        </div>
    );
};

export default TicketListComponent;
