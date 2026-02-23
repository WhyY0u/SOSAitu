import { FaRegCalendarAlt, FaRegCommentDots, FaRegUserCircle, FaRobot } from 'react-icons/fa';
import styles from './style/Style.module.css'
import { IoSettingsOutline } from 'react-icons/io5';
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import SelectedStatus from '../../selectedStatus/SelectedStatus';
import { type Ticket, type TicketStatus } from '@/domain/entities/ticket/Ticket';
import type { User } from '@/domain/entities/user/User';
import { ApiTicketFeedbackRepository } from '@/data/repositories/ticket/remote/ApiTicketFeedbackRepository';
import ApiAdminTicketRepository from '@/data/repositories/ticket/remote/ApiAdminTicketRepository';
import ApiSupportTicketRepository from '@/data/repositories/support/remote/ApiSupportTicketRepository';
import { formatTicketDate } from '@/shared/dateUtils';

interface TicketComponentProps {
    ticket: Ticket;
    user: User;
    mode?: 'admin' | 'user' | 'support';
    onTicketUpdated?: (ticket: Ticket) => void;
}

const TicketComponent = ({ user, ticket, mode = 'admin', onTicketUpdated }: TicketComponentProps) => {
    const [localTicket, setLocalTicket] = useState(ticket);
    const [showInput, setShowInput] = useState(false);
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [expanded, setExpanded] = useState(false);
    const canManageTicket = mode === 'admin' || mode === 'support';
    const [isSaving, setIsSaving] = useState(false);
    const adminTicketRepository = useMemo(() => new ApiAdminTicketRepository(), []);
    const supportTicketRepository = useMemo(() => new ApiSupportTicketRepository(), []);
    const feedbackRepository = useMemo(() => new ApiTicketFeedbackRepository(), []);
    const [feedbackScore, setFeedbackScore] = useState<number | null>(localTicket.satisfactionScore ?? null);
    const [feedbackComment, setFeedbackComment] = useState(localTicket.satisfactionComment ?? '');
    const [isSendingFeedback, setIsSendingFeedback] = useState(false);

    // Защита от undefined user
    if (!user) {
        return null;
    }

    useEffect(() => {
        setLocalTicket(ticket);
        setFeedbackScore(ticket.satisfactionScore ?? null);
        setFeedbackComment(ticket.satisfactionComment ?? '');
    }, [ticket]);

    // Проверяем, есть ли детали для отображения
    const hasDetails = useMemo(() => {
        const adminResponse = localTicket.administratorResponse || localTicket.comment;
        if (mode === 'admin') {
            return !!(localTicket.ai_comments?.trim() || adminResponse);
        }
        if (mode === 'user') {
            return !!(adminResponse || (localTicket.status === 'Completed' && !feedbackScore));
        }
        return false;
    }, [localTicket, mode, feedbackScore]);

    // Форматирует ответ администратора: убирает markdown и выделяет имя/время
    const formatAdminResponse = (response: string) => {
        // Если это формат "**Имя** (дата):\nтекст", преобразуем в HTML
        const match = response.match(/^\*\*(.+?)\*\*\s*\(([^)]+)\):\s*(.*)$/s);
        if (match) {
            const [, name, dateTime, text] = match;
            return (
                <div>
                    <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #d0e3f0' }}>
                        <span style={{ fontWeight: 600, color: '#2c3e50' }}>{name}</span>
                        <span style={{ color: '#7f8c8d', fontSize: '13px', marginLeft: '10px' }}>
                            {dateTime}
                        </span>
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{text.trim()}</div>
                </div>
            );
        }
        // Если есть разделители "---", показываем историю ответов
        if (response.includes('---')) {
            const parts = response.split('---');
            return (
                <div>
                    {parts.map((part: string, index: number) => {
                        const trimmed = part.trim();
                        const partMatch = trimmed.match(/^\*\*(.+?)\*\*\s*\(([^)]+)\):\s*(.*)$/s);
                        if (partMatch) {
                            const [, name, dateTime, text] = partMatch;
                            return (
                                <div key={index} style={{ 
                                    marginBottom: index < parts.length - 1 ? '16px' : '0',
                                    paddingBottom: index < parts.length - 1 ? '16px' : '0',
                                    borderBottom: index < parts.length - 1 ? '1px solid #d0e3f0' : 'none'
                                }}>
                                    <div style={{ marginBottom: '8px' }}>
                                        <span style={{ fontWeight: 600, color: '#2c3e50' }}>{name}</span>
                                        <span style={{ color: '#7f8c8d', fontSize: '13px', marginLeft: '10px' }}>
                                            {dateTime}
                                        </span>
                                    </div>
                                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{text.trim()}</div>
                                </div>
                            );
                        }
                        return <div key={index} style={{ whiteSpace: 'pre-wrap' }}>{trimmed}</div>;
                    })}
                </div>
            );
        }
        // Простой текст без форматирования
        return <span style={{ whiteSpace: 'pre-wrap' }}>{response}</span>;
    };

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
            if (mode === 'support') {
                await supportTicketRepository.updateTicket({
                    ticketId: localTicket.id,
                    status: nextTicket.status,
                    comment: nextTicket.comment,
                });
            } else {
                await adminTicketRepository.updateTicket({
                    ticketId: localTicket.id,
                    status: nextTicket.status,
                    comment: nextTicket.comment,
                });
            }
            setLocalTicket(nextTicket);
            onTicketUpdated?.(nextTicket);
        } catch (error) {
            console.error('Ошибка обновления тикета:', error);
        } finally {
            setIsSaving(false);
        }
    }, [adminTicketRepository, supportTicketRepository, canManageTicket, localTicket, mode, onTicketUpdated]);

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

    const handleSendFeedback = async () => {
        if (mode !== 'user') return;
        if (!feedbackScore) return;
        setIsSendingFeedback(true);
        try {
            await feedbackRepository.sendFeedback(localTicket.id, {
                score: feedbackScore,
                comment: feedbackComment || undefined,
            });

            setLocalTicket({
                ...localTicket,
                satisfactionScore: feedbackScore,
                satisfactionComment: feedbackComment,
            });
        } catch (e) {
            console.error('Не удалось отправить отзыв по тикету', e);
        } finally {
            setIsSendingFeedback(false);
        }
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

            {hasDetails && (
                <button
                    className={styles.expand_button}
                    onClick={() => setExpanded(!expanded)}
                    aria-expanded={expanded}
                >
                    {expanded ? "Свернуть детали" : "Развернуть детали"}
                </button>
            )}

            {expanded && hasDetails && (
                <div className={styles.extra_content}>
                    {mode === 'admin' && localTicket.ai_comments?.trim() && (
                        <div className={styles.ai_comment_block}>
                            <div className={styles.ai_comment_header}>
                                <FaRobot className={styles.ai_icon} />
                                <span className={styles.ai_title}>Комментарий от ИИ</span>
                            </div>
                            <p className={styles.ai_comment_text}>{localTicket.ai_comments}</p>
                        </div>
                    )}

                    {mode === 'admin' && (localTicket.administratorResponse || localTicket.comment) && (
                        <div className={styles.ai_comment_block}>
                            <div className={styles.ai_comment_header}>
                                <FaRegCommentDots className={styles.ai_icon} />
                                <span className={styles.ai_title}>Комментарий администратора</span>
                            </div>
                            <div className={styles.ai_comment_text}>
                                {formatAdminResponse(localTicket.administratorResponse || localTicket.comment)}
                            </div>
                        </div>
                    )}

                    {mode === 'user' && (localTicket.administratorResponse || localTicket.comment) && (
                        <div className={styles.ai_comment_block}>
                            <div className={styles.ai_comment_header}>
                                <FaRegCommentDots className={styles.ai_icon} />
                                <span className={styles.ai_title}>Ответ администратора</span>
                            </div>
                            <div className={styles.ai_comment_text}>
                                {formatAdminResponse(localTicket.administratorResponse || localTicket.comment)}
                            </div>
                        </div>
                    )}

                    {mode === 'user' && localTicket.status === 'Completed' && feedbackScore === null && (
                        <div className={styles.feedback_block}>
                            <div className={styles.ai_comment_header}>
                                <span className={styles.ai_title}>Оцените ответ</span>
                            </div>
                            <div className={styles.feedback_controls}>
                                <select
                                    className={styles.feedback_select}
                                    value={feedbackScore ?? ''}
                                    onChange={(e) => setFeedbackScore(e.target.value ? Number(e.target.value) : null)}
                                >
                                    <option value="">Выберите оценку</option>
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                                <textarea
                                    className={styles.feedback_textarea}
                                    placeholder="Оставьте комментарий (необязательно)"
                                    value={feedbackComment}
                                    onChange={(e) => setFeedbackComment(e.target.value)}
                                />
                                <button
                                    className={styles.button}
                                    disabled={!feedbackScore || isSendingFeedback}
                                    onClick={handleSendFeedback}
                                >
                                    {isSendingFeedback ? 'Отправка...' : 'Отправить отзыв'}
                                </button>
                            </div>
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
