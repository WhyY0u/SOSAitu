import { FaRegCalendarAlt, FaRegCommentDots, FaRegUserCircle, FaRobot } from 'react-icons/fa';
import styles from './style/Style.module.css'
import { IoSettingsOutline } from 'react-icons/io5';
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import SelectedStatus from '../../selectedStatus/SelectedStatus';
import { type Ticket, type TicketStatus } from '@/domain/entities/ticket/Ticket';
import type { User } from '@/domain/entities/user/User';
import ApiAdminTicketRepository from '@/data/repositories/ticket/remote/ApiAdminTicketRepository';
import { formatTicketDate } from '@/shared/dateUtils';

interface TicketComponentProps {
    ticket: Ticket;
    user: User;
    mode?: 'admin' | 'user';
    onTicketUpdated?: (ticket: Ticket) => void;
}

const TicketComponent = ({ user, ticket, mode = 'admin', onTicketUpdated }: TicketComponentProps) => {
    const [localTicket, setLocalTicket] = useState(ticket);
    const [showInput, setShowInput] = useState(false);
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [expanded, setExpanded] = useState(false);
    const canManageTicket = mode === 'admin';
    const [isSaving, setIsSaving] = useState(false);
    const adminTicketRepository = useMemo(() => new ApiAdminTicketRepository(), []);

    useEffect(() => {
        setLocalTicket(ticket);
    }, [ticket]);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
        setMessage(e.target.value);
    };

    const applyTicketUpdate = useCallback(async (payload: { status?: TicketStatus; comment?: string }) => {
        if (!canManageTicket) return;

        const nextTicket: Ticket = {
            ...localTicket,
            status: payload.status ?? localTicket.status,
            comment: payload.comment ?? localTicket.comment,
        };

        setIsSaving(true);
        try {
            await adminTicketRepository.updateTicket({
                ticketId: localTicket.id,
                status: nextTicket.status,
                comment: nextTicket.comment,
            });
            setLocalTicket(nextTicket);
            onTicketUpdated?.(nextTicket);
        } catch (error) {
            console.error('Ошибка обновления тикета администратора:', error);
        } finally {
            setIsSaving(false);
        }
    }, [adminTicketRepository, canManageTicket, localTicket, onTicketUpdated]);

    const handleUpdateTicketStatus = useCallback((status: TicketStatus) => {
        if (isSaving) return;
        void applyTicketUpdate({ status });
    }, [applyTicketUpdate, isSaving]);

    const handleSendComment = async () => {
        if (isSaving) return;
        const nextComment = message.trim();
        if (!nextComment) return;
        await applyTicketUpdate({ comment: nextComment });
        setMessage("");
        setShowInput(false);
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
                    {mode === 'admin' && localTicket.ai_comments.trim() && (
                        <div className={styles.ai_comment_block}>
                            <div className={styles.ai_comment_header}>
                                <FaRobot className={styles.ai_icon} />
                                <span className={styles.ai_title}>Комментарий от ИИ</span>
                            </div>
                            <p className={styles.ai_comment_text}>{localTicket.ai_comments}</p>
                        </div>
                    )}

                    {mode === 'admin' && localTicket.comment && (
                        <div className={styles.ai_comment_block}>
                            <div className={styles.ai_comment_header}>
                                <FaRegCommentDots className={styles.ai_icon} />
                                <span className={styles.ai_title}>Комментарий администратора</span>
                            </div>
                            <p className={styles.ai_comment_text}>{localTicket.comment}</p>
                        </div>
                    )}

                    {mode === 'user' && localTicket.comment && (
                        <div className={styles.ai_comment_block}>
                            <div className={styles.ai_comment_header}>
                                <FaRegCommentDots className={styles.ai_icon} />
                                <span className={styles.ai_title}>Ответ администратора</span>
                            </div>
                            <p className={styles.ai_comment_text}>{localTicket.comment}</p>
                        </div>
                    )}

                    {canManageTicket && (
                        <>
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
                                    <p className={styles.send_message} onClick={handleSendComment}>
                                        {isSaving ? 'Сохранение...' : 'Отправить'}
                                    </p>
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
                            <SelectedStatus onUpdate={handleUpdateTicketStatus} ticket={localTicket} />
                        </>
                    )}
                </div>
            )}
        </div>
    </>
}

export default TicketComponent;
