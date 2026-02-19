import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './styles/Style.module.css';
import type { Ticket, TicketResponse } from '@/domain/repositories/support/SupportRepository';
import SupportApiRepository from '@/data/repositories/support/remote/ApiSupportRepository';
import { TicketStatus } from '@/domain/entities/ticket/Ticket';

type ActiveSection = 'tickets';

interface TicketType {
    code: string;
    title: string;
}

const Support = () => {
    const [activeSection, setActiveSection] = useState<ActiveSection>('tickets');
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [responseText, setResponseText] = useState('');
    const [aiSummary, setAiSummary] = useState('');
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('Все');
    const [typeFilter, setTypeFilter] = useState<string>('Все');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'status'>('date');
    const [showModal, setShowModal] = useState(false);
    const [newStatus, setNewStatus] = useState<string>('InProgress');
    const [availableTypes, setAvailableTypes] = useState<TicketType[]>([]);

    const api = new SupportApiRepository();

    useEffect(() => {
        fetchAvailableTypes();
        fetchTickets();
    }, [statusFilter, typeFilter, searchQuery]);

    const fetchAvailableTypes = async () => {
        try {
            const types = await api.getTicketTypes();
            setAvailableTypes(types);
        } catch (err) {
            console.error('Ошибка при загрузке типов:', err);
            setAvailableTypes([]);
        }
    };

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const data = await api.getTickets(statusFilter, typeFilter, searchQuery);
            let sortedTickets = data.items;
            
            if (sortBy === 'date') {
                sortedTickets.sort((a, b) => 
                    new Date(b.ticket.createdTime).getTime() - new Date(a.ticket.createdTime).getTime()
                );
            } else {
                sortedTickets.sort((a, b) => a.ticket.status.localeCompare(b.ticket.status));
            }
            
            setTickets(sortedTickets);
        } catch (err) {
            console.error('Ошибка при загрузке тикетов:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTicket = async (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setShowModal(true);
        setResponseText('');
        setNewStatus('InProgress');
        setAiSuggestions([]);
        setLoadingSuggestions(false);

        // Загружаем AI краткое описание
        try {
            const summary = await api.getAiSummary(ticket.ticket.id);
            setAiSummary(summary);
        } catch (err) {
            setAiSummary('');
        }
    };

    const handleLoadAiSuggestions = async () => {
        if (!selectedTicket) return;
        
        setLoadingSuggestions(true);
        try {
            const suggestions = await api.getAiSuggestions(selectedTicket.ticket.id);
            setAiSuggestions(suggestions);
        } catch (err) {
            console.error('Ошибка при загрузке AI-заготовок:', err);
            setAiSuggestions([]);
            alert('Не удалось загрузить AI-заготовки');
        } finally {
            setLoadingSuggestions(false);
        }
    };

    const handleSelectAiSuggestion = (suggestion: string) => {
        setResponseText(suggestion);
    };

    const handleAddResponse = async () => {
        if (!selectedTicket || !responseText.trim()) {
            alert('Введите текст ответа');
            return;
        }

        try {
            await api.addResponse(selectedTicket.ticket.id, {
                response: responseText,
                status: newStatus
            });
            
            setShowModal(false);
            setResponseText('');
            fetchTickets();
            alert('Ответ добавлен');
        } catch (err: any) {
            alert(err.response?.data || 'Ошибка при отправке ответа');
        }
    };

    const handleUpdateStatus = async (ticketId: number, status: string) => {
        try {
            await api.updateStatus(ticketId, { status });
            fetchTickets();
            alert('Статус обновлён');
        } catch (err: any) {
            alert(err.response?.data || 'Ошибка при обновлении статуса');
        }
    };

    const filteredTickets = tickets.filter((tr) => {
        const ticket = tr.ticket;
        if (statusFilter !== 'Все' && ticket.status !== statusFilter) return false;
        if (typeFilter !== 'Все' && ticket.type !== typeFilter) return false;
        if (searchQuery && !ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
            !ticket.description.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        return true;
    });

    if (loading) {
        return <div className={styles.main_container}>Загрузка...</div>;
    }

    return (
        <div className={styles.main_container}>
            <p className={styles.text_one}>🎧 Панель Support</p>
            <p className={styles.text_two}>Отвечайте на тикеты и управляйте статусами</p>

            {/* Фильтры и поиск */}
            <div className={styles.filters_container}>
                <div className={styles.search_box}>
                    <input
                        type="text"
                        className={styles.search_input}
                        placeholder="🔍 Поиск по тикетам..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className={styles.filters}>
                    <select
                        className={styles.filter_select}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="Все">Все статусы</option>
                        <option value="Expectation">Ожидание</option>
                        <option value="InProgress">В работе</option>
                        <option value="Completed">Завершено</option>
                    </select>

                    <select
                        className={styles.filter_select}
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="Все">Все типы</option>
                        {availableTypes.map(type => (
                            <option key={type.code} value={type.code}>
                                {type.title}
                            </option>
                        ))}
                    </select>

                    <select
                        className={styles.filter_select}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'date' | 'status')}
                    >
                        <option value="date">По дате</option>
                        <option value="status">По статусу</option>
                    </select>
                </div>
            </div>

            {/* Список тикетов */}
            <div className={styles.tickets_container}>
                {filteredTickets.length === 0 ? (
                    <div className={styles.empty_state}>
                        <p>Тикетов не найдено</p>
                    </div>
                ) : (
                    <div className={styles.tickets_grid}>
                        {filteredTickets.map((tr) => {
                            const ticket = tr.ticket;
                            return (
                                <div 
                                    key={ticket.id} 
                                    className={`${styles.ticket_card} ${styles[ticket.status]}`}
                                    onClick={() => handleSelectTicket(tr)}
                                >
                                    <div className={styles.ticket_header}>
                                        <span className={styles.ticket_id}>#{ticket.id}</span>
                                        <span className={`${styles.status_badge} ${styles[ticket.status]}`}>
                                            {ticket.status === 'Expectation' && '🔴 Ожидание'}
                                            {ticket.status === 'InProgress' && '🟡 В работе'}
                                            {ticket.status === 'Completed' && '🟢 Завершено'}
                                        </span>
                                    </div>
                                    
                                    <h3 className={styles.ticket_title}>{ticket.name}</h3>
                                    <p className={styles.ticket_description}>
                                        {ticket.description.substring(0, 100)}...
                                    </p>
                                    
                                    <div className={styles.ticket_footer}>
                                        <span className={styles.ticket_type}>📋 {ticket.type}</span>
                                        <span className={styles.ticket_date}>
                                            {new Date(ticket.createdTime).toLocaleDateString('ru-RU')}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Модальное окно тикета */}
            {showModal && selectedTicket && (
                <div className={styles.modal_overlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal_content} onClick={e => e.stopPropagation()}>
                        <div className={styles.modal_header}>
                            <div>
                                <h2 className={styles.modal_title}>
                                    #{selectedTicket.ticket.id} - {selectedTicket.ticket.name}
                                </h2>
                                <p className={styles.modal_description}>
                                    📋 {selectedTicket.ticket.type} | 
                                    📅 {new Date(selectedTicket.ticket.createdTime).toLocaleString('ru-RU')}
                                </p>
                            </div>
                            <button 
                                className={styles.close_button}
                                onClick={() => setShowModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {/* AI краткое описание */}
                        {aiSummary && (
                            <div className={styles.ai_summary}>
                                <h4 className={styles.ai_summary_title}>🤖 AI-кратко:</h4>
                                <p>{aiSummary}</p>
                            </div>
                        )}

                        <div className={styles.modal_body}>
                            <div className={styles.ticket_info}>
                                <h4 className={styles.info_title}>📝 Описание:</h4>
                                <p className={styles.info_text}>{selectedTicket.ticket.description}</p>
                                
                                {selectedTicket.ticket.administratorResponse && (
                                    <>
                                        <h4 className={styles.info_title}>💬 Ответы:</h4>
                                        <div className={styles.responses}>
                                            <ReactMarkdown>{selectedTicket.ticket.administratorResponse}</ReactMarkdown>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className={styles.response_form}>
                                <h4 className={styles.info_title}>✍️ Ваш ответ:</h4>
                                
                                {/* Кнопка загрузки AI-заготовок */}
                                <div className={styles.ai_suggestions_block}>
                                    <button
                                        className={styles.ai_suggestions_button}
                                        onClick={handleLoadAiSuggestions}
                                        disabled={loadingSuggestions}
                                    >
                                        {loadingSuggestions ? '⏳ Загрузка...' : '🤖 Подобрать AI-заготовки'}
                                    </button>
                                    
                                    {/* Отображение AI-заготовок */}
                                    {aiSuggestions.length > 0 && (
                                        <div className={styles.ai_suggestions_list}>
                                            <p className={styles.ai_suggestions_title}>Выберите вариант ответа:</p>
                                            {aiSuggestions.map((suggestion, index) => (
                                                <div
                                                    key={index}
                                                    className={styles.ai_suggestion_item}
                                                    onClick={() => handleSelectAiSuggestion(suggestion)}
                                                >
                                                    <span className={styles.suggestion_number}>{index + 1}.</span>
                                                    <p className={styles.suggestion_text}>{suggestion}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                <textarea
                                    className={styles.response_textarea}
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    placeholder="Введите ваш ответ или выберите AI-заготовку..."
                                    rows={5}
                                />

                                <div className={styles.status_selector}>
                                    <label className={styles.status_label}>
                                        Изменить статус:
                                        <select
                                            className={styles.status_select}
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                        >
                                            <option value="Expectation">🔴 Ожидание</option>
                                            <option value="InProgress">🟡 В работе</option>
                                            <option value="Completed">🟢 Завершено</option>
                                        </select>
                                    </label>
                                </div>

                                <div className={styles.modal_actions}>
                                    <button
                                        className={styles.cancel_button}
                                        onClick={() => setShowModal(false)}
                                    >
                                        Отмена
                                    </button>
                                    <button
                                        className={styles.submit_button}
                                        onClick={handleAddResponse}
                                    >
                                        Отправить ответ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Support;
