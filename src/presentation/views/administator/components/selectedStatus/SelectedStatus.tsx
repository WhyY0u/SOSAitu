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
    onUpdate: (status: TicketStatus) => void;
}

const statuses: Status[] = [
    { value: TicketStatus.Expectation, label: "Новый", icon: <BsClock className={`${styles.image_icon}`} size={19} /> },
    { value: TicketStatus.InProgress, label: "В работе", icon: <BiCheckCircle className={`${styles.image_icon}`} size={19} /> },
    { value: TicketStatus.Completed, label: "Закрыт", icon: <BiXCircle className={`${styles.image_icon}`} size={19} /> },
];

const SelectedStatus = ({ ticket, onUpdate }: SelectedStatusProps) => {
    const [selected, setSelected] = useState(ticket.status);

    useEffect(() => {
        setSelected(ticket.status);
    }, [ticket.status]);

    useEffect(() => {
        if (selected !== ticket.status) {
            onUpdate(selected);
        }
    }, [onUpdate, selected, ticket.status]);

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
