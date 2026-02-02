import type { Ticket } from '@/domain/entities/ticket/Ticket';
import styles from './style/Style.module.css';
import React from 'react';
import TicketComponent from './components/TicketComponent';
import { type User } from '@/domain/entities/user/User';

interface TicketListComponentProps {
    list: Ticket[];
    user : User;
}

const TicketListComponent = ({ user, list }: TicketListComponentProps) => {
    const [tickets, setTickets] = React.useState<Ticket[]>([]);

    React.useEffect(() => {
        setTickets(list)
    }, [list]);

    return (
        <div className={styles.ticket_list_container}>
            {tickets.map(ticket => (
                <TicketComponent key={ticket.id} user={user} ticket={ticket} />
            ))}
        </div>
    );
};

export default TicketListComponent;
