import { FaRegCalendarAlt, FaRegCommentDots, FaRegUserCircle, FaRobot } from 'react-icons/fa';
import styles from './style/Style.module.css'
import { IoSettingsOutline } from 'react-icons/io5';
import { useRef, useState } from 'react';
import SelectedStatus from '../../selectedStatus/SelectedStatus';
import type { Ticket } from '@/domain/entities/ticket/Ticket';
import type { User } from '@/domain/entities/user/User';
import ApiTicketRepository from '@/data/repositories/ticket/remote/ApiTicketRepository';
import { formatTicketDate } from '@/shared/dateUtils';

interface TicketComponentProps {
    ticket: Ticket;
    user: User;
}

const TicketComponent = ({ user, ticket }: TicketComponentProps) => {
    console.log(user)
    const [localTicket, setLocalTicket] = useState(ticket);
    const [showInput, setShowInput] = useState(false);
    const [message, setMessage] = useState("");
    const textareaRef = useRef(null);
    const [expanded, setExpanded] = useState(false);
    const handleChange = (e) => {
        const el = textareaRef.current;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
        setMessage(e.target.value);
    };
    const ticketRepository = new ApiTicketRepository();

    const handleUpdateTicket = (updatedTicket: Ticket) => {
        ticketRepository.updateTicket(updatedTicket);
        setLocalTicket(updatedTicket);
    };


    return <>
        <div className={`${styles.ticket_container}`}>
            <div className={`${styles.ticket_line_one}`}>
                <p className={`${styles.ticket_number}`}>#{localTicket.id}</p>
                <p className={`${styles.ticket_status_name}`}>{localTicket.status}</p>
            </div>
            <p className={`${styles.ticket_name}`}>{localTicket.name}</p>
            <div className={`${styles.display}`}>
                <FaRegUserCircle className={styles.user_icon} />
                <p className={`${styles.ticket_creator_name}`}>{user.fullName}</p>
                <FaRegCalendarAlt className={styles.ticket_icon_create_data} />
                <p className={`${styles.ticket_create_data}`}>{formatTicketDate(ticket.createdTime)}</p>
                <IoSettingsOutline className={styles.ticket_type_settings} />
                <p className={`${styles.ticket_type}`}>{localTicket.type}</p>
            </div>
            <p className={`${styles.description_text}`}>{localTicket.description}</p>

            <button
                className={styles.expand_button}
                onClick={() => setExpanded(!expanded)}
            >
                {expanded ? "Свернуть детали" : "Развернуть детали"}
            </button>

            {expanded && (
                <div className={styles.extra_content}>
                    <div className={styles.ai_comment_block}>
                        <div className={styles.ai_comment_header}>
                            <FaRobot className={styles.ai_icon} />
                            <span className={styles.ai_title}>Комментарий от ИИ</span>
                        </div>
                        <p className={styles.ai_comment_text}>{ticket.ai_comments}</p>
                    </div>
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

                    {showInput && (
                        <div className={styles.ticket_margin} style={{ textAlign: 'right' }}>
                            <p className={styles.send_message}>Отправить</p>
                            <p
                                className={styles.cancel_text}
                                onClick={() => {
                                    setMessage("");
                                    setShowInput(false);
                                }}
                            >
                                Отмена
                            </p>
                        </div>
                    )}
                    <SelectedStatus onUpdate={handleUpdateTicket} ticket={localTicket} />
                </div>
            )}
        </div>
    </>
}

export default TicketComponent;