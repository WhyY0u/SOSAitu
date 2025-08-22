import styles from './styles/Style.module.css'
import ContainerStats from './components/containerStats/ContainerStats';
import SortedContainer from './components/sortedContainer/SortedContainer';
import TicketListComponent from './components/ticketList/TicketList';
import { useEffect, useState } from 'react';
import { InMemoryTicketRepository } from '@/data/repositories/ticket/memory/InMemoryTicketRepository';
import type { TicketStatusFilter } from './components/sortedStatusContainer/SortedStatusContainer';
import type { SortBy } from './components/sortedClickContainer/SortedClickContainer';
import { TicketStatus, type Ticket } from '@/domain/entities/ticket/Ticket';

type TicketListState = {
    total: number;
    items: Ticket[];
};

const Home = () => {
    const [selectedStatus, setSelectedStatus] = useState<TicketStatusFilter>("Все");
    const [sortBy, setSortBy] = useState<SortBy>(null);
    const ticketRepository = new InMemoryTicketRepository();
    const [ticketList, setTicketList] = useState<TicketListState>({ total: 0, items: [] });
    const [counts, setCounts] = useState({ all: 0, new: 0, inProgress: 0, closed: 0 });
    useEffect(() => {
        ticketRepository.getTickets({ sortBy: 'date', status: 'Все' }).then(data => {
            setTicketList(data);
            const newCounts = data.items.reduce(
                (acc, ticket) => {
                    switch (ticket.ticketStatus) {
                        case TicketStatus.New:
                            console.log(ticket.ticketStatus)
                            acc.new += 1;
                            break;
                        case TicketStatus.In_Progress:
                            acc.inProgress += 1;
                            break;
                        case TicketStatus.Closed:
                            acc.closed += 1;
                            break;
                    }
                    acc.all += 1;
                    return acc;
                },
                { all: 0, new: 0, inProgress: 0, closed: 0 }
            );
            setCounts(newCounts);
        });

    }, []);
    const handleStatusChange = (status: TicketStatusFilter) => {
        setSelectedStatus(status);
    };
    useEffect(() => {
        ticketRepository.getTickets({ sortBy: sortBy, status: selectedStatus }).then(data => {
            setTicketList(data);
        });

    }, [sortBy, selectedStatus])
    return (
        <div className={`${styles.main_container}`}>
            <p className={`${styles.name}`}>Добро пожаловать,<br /> <span className={`${styles.name_gradient}`}> {localStorage.getItem('name')}!</span></p>
            <p className={`${styles.ticket_status}`}>Создавайте тикеты и отслеживайте их статус</p>
            <ContainerStats counts={counts} />
            <SortedContainer counts={counts} sortBy={sortBy} onSortChange={setSortBy} onStatusChange={handleStatusChange} selectedStatus={selectedStatus} />
            <div className={`${styles.ticket_list_name}`}>
                <p className={styles.ticket_name}>
                    Тикеты
                    {selectedStatus !== "Все" && (
                        <span className={styles.color_grey}>• {selectedStatus}</span>
                    )}
                </p>                <p className={`${styles.ticket_count}`}>{ticketList.items.length} из {ticketList.total}</p>
            </div>
            <TicketListComponent list={ticketList.items} />

        </div>
    );
};

export default Home;