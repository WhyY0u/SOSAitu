import React from 'react';
import styles from './style/Style.module.css';
import type { Ticket } from '@/domain/entities/ticket/Ticket';
import type { User } from '@/domain/entities/user/User';
import TicketComponent from './components/TicketComponent';

interface TicketResponse {
    ticket: Ticket;
    user: User;
}

interface TicketListComponentProps {
    list: TicketResponse[];
}

const TicketListComponent = ({ list }: TicketListComponentProps) => {
    const [tickets, setTickets] = React.useState<TicketResponse[]>([]);

    React.useEffect(() => {
        setTickets(list);
    }, [list]);

    return (
        <div className={styles.ticket_list_container}>
            {tickets.map(({ ticket, user }) => (
                <TicketComponent key={ticket.id} ticket={ticket} user={user} />
            ))}
        </div>
    );
};

export default TicketListComponent;
