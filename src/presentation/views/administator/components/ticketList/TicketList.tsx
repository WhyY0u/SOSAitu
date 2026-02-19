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
    list: TicketResponse[] | Ticket[];
    mode?: 'admin' | 'user' | 'support';
    onTicketUpdated?: (ticket: Ticket) => void;
}

const TicketListComponent = ({ list, mode = 'admin', onTicketUpdated }: TicketListComponentProps) => {
    const [tickets, setTickets] = React.useState<TicketResponse[]>([]);

    React.useEffect(() => {
        const normalizedTickets = list.map((item) => {
            if ('ticket' in item && 'user' in item) {
                return item;
            }

            return {
                ticket: item,
                user: item.userCreate,
            };
        });

        setTickets(normalizedTickets);
    }, [list]);

    return (
        <div className={styles.ticket_list_container}>
            {tickets.map(({ ticket, user }) => (
                <TicketComponent key={ticket.id} ticket={ticket} user={user} mode={mode} onTicketUpdated={onTicketUpdated} />
            ))}
        </div>
    );
};

export default TicketListComponent;
