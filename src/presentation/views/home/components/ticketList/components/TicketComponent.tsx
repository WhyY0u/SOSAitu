import { FaRegCalendarAlt, FaRegCommentDots, FaRegUserCircle } from 'react-icons/fa';
import styles from './style/Style.module.css'
import { IoSettingsOutline } from 'react-icons/io5';
import { useRef, useState } from 'react';
import SelectedStatus from '../../selectedStatus/SelectedStatus';
import type { Ticket } from '@/domain/entities/ticket/Ticket';
import { InMemoryTicketRepository } from '@/data/repositories/ticket/memory/InMemoryTicketRepository';

interface TicketComponentProps {
    ticket: Ticket;
}

const TicketComponent = ({ ticket }: TicketComponentProps) => {
    const [localTicket, setLocalTicket] = useState(ticket);
    const [showInput, setShowInput] = useState(false);
    const [message, setMessage] = useState("");
    const textareaRef = useRef(null);

    const handleChange = (e) => {
        const el = textareaRef.current;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
        setMessage(e.target.value);
    };
    const ticketRepository = new InMemoryTicketRepository();

    const handleUpdateTicket = (updatedTicket: Ticket) => {
        ticketRepository.updateTicket(updatedTicket);
        setLocalTicket(updatedTicket);
    };


    return <>
        <div className={`${styles.ticket_container}`}>
            <div className={`${styles.ticket_line_one}`}>
                <p className={`${styles.ticket_number}`}>#{localTicket.id}</p>
                <p className={`${styles.ticket_status_name}`}>{localTicket.ticketStatus}</p>
            </div>
            <p className={`${styles.ticket_name}`}>{localTicket.name}</p>
            <div className={`${styles.display}`}>
                <FaRegUserCircle className={styles.user_icon} />
                <p className={`${styles.ticket_creator_name}`}>{localTicket.userCreate.fullname}</p>
                <FaRegCalendarAlt className={styles.ticket_icon_create_data} />
                <p className={`${styles.ticket_create_data}`}>9 августа 2025 г. в 14:00</p>
                <IoSettingsOutline className={styles.ticket_type_settings} />
                <p className={`${styles.ticket_type}`}>{localTicket.ticketType}</p>
            </div>
            <p className={`${styles.description_text}`}>{localTicket.description}</p>



            {!showInput ? (
                <button className={styles.button} onClick={() => setShowInput(true)}>
                    <FaRegCommentDots className={styles.button_icon} />
                    Написать сообщение
                </button>
            ) : (
                <div className={styles.input_wrapper}>
                    <div className={styles.input_with_icon}>
                        <textarea
                            ref={textareaRef}
                            className={styles.message_input}
                            placeholder="Введите сообщение..."
                            value={message}
                            onChange={handleChange}
                            rows={1}
                        />
                    </div>
                </div>
            )}
            {!showInput ? '' : <div className={`${styles.ticket_margin}`} style={{ textAlign: 'right' }}>
                <p className={`${styles.send_message}`}>Отправить</p>
                <p className={styles.cancel_text} onClick={() => { setMessage(""); setShowInput(false); }}>
                    Отмена
                </p>
            </div>}
            <SelectedStatus onUpdate={handleUpdateTicket} ticket={localTicket} />
        </div>
    </>
}

export default TicketComponent;