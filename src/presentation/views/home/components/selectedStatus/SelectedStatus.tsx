import { useEffect, useState, type JSX } from "react";
import styles from "./style/Style.module.css";
import { BsClock } from "react-icons/bs";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";
import { TicketStatus, type Ticket } from "@/domain/entities/ticket/Ticket";

interface Status {
    value: TicketStatus;
    label: string;
    icon: JSX.Element;
}

interface SelectedStatusProps {
    ticket: Ticket;
    onUpdate: (updatedTicket: Ticket) => void;
}

const statuses: Status[] = [
    { value: TicketStatus.New, label: "Новый", icon: <BsClock className={`${styles.image_icon}`} size={19} /> },
    { value: TicketStatus.In_Progress, label: "В работе", icon: <BiCheckCircle className={`${styles.image_icon}`} size={19} /> },
    { value: TicketStatus.Closed, label: "Закрыт", icon: <BiXCircle className={`${styles.image_icon}`} size={19} /> },
];

const SelectedStatus = ({ ticket, onUpdate }: SelectedStatusProps) => {
    const [selected, setSelected] = useState(ticket.ticketStatus);
    useEffect(() => {
        if (selected !== ticket.ticketStatus) {
            const updatedTicket = {
                ...ticket,
                ticketStatus: selected
            };
            onUpdate(updatedTicket);
        }
    }, [selected]);

    return (
        <div className={styles.status_list}>
            {statuses.map((status) => (
                <button
                    key={status.value}
                    onClick={() => setSelected(status.value)}
                    className={`${styles.status_item} ${selected === status.value ? styles.status_item_selected : ""
                        }`}
                >
                    {status.icon}
                    <span>{status.label}</span>
                </button>
            ))}
        </div>
    );
};

export default SelectedStatus;
