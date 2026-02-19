import { useEffect, useState } from 'react';
import SupervisorApiRepository from '@/data/repositories/supervisor/remote/ApiSupervisorRepository';
import type { TicketType } from '@/domain/repositories/user/UserRepository';
import Modal from '@/shared/ui/Modal';
import styles from '../../styles/Style.module.css';

interface Support {
    id: number;
    fullName: string;
    category: string;
    decided: number;
    inWork: number;
    averageTime?: number;
    avgSatisfaction?: number;
    status: string;
}

const SupportManager = () => {
    const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
    const [supports, setSupports] = useState<Support[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddSupport, setShowAddSupport] = useState(false);
    const [supportUserId, setSupportUserId] = useState<string>('');
    const [supportTypes, setSupportTypes] = useState<string[]>([]);

    const [modal, setModal] = useState<{
        isOpen: boolean;
        type: 'confirm' | 'info';
        title: string;
        message: string;
        onConfirm?: () => void;
    }>({ isOpen: false, type: 'info', title: '', message: '' });

    const api = new SupervisorApiRepository();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsData, typesData] = await Promise.all([
                    api.getAnalytics(),
                    api.getTicketTypes(),
                ]);
                setSupports(analyticsData.supportPerformance || []);
                setTicketTypes(typesData);
            } catch (err) {
                console.error('Ошибка при загрузке данных:', err);
                setModal({
                    isOpen: true,
                    type: 'info',
                    title: 'Ошибка',
                    message: 'Не удалось загрузить данные'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddSupport = async () => {
        if (!supportUserId || supportTypes.length === 0) {
            setModal({ 
                isOpen: true, 
                type: 'info', 
                title: 'Ошибка', 
                message: 'Введите ID пользователя и выберите типы тикетов' 
            });
            return;
        }

        try {
            await api.addSupport(parseInt(supportUserId), supportTypes);
            setModal({ 
                isOpen: true, 
                type: 'info', 
                title: 'Успешно', 
                message: 'Support назначен' 
            });
            setShowAddSupport(false);
            setSupportUserId('');
            setSupportTypes([]);
            
            // Обновляем список
            const analyticsData = await api.getAnalytics();
            setSupports(analyticsData.supportPerformance || []);
        } catch (err: any) {
            setModal({
                isOpen: true,
                type: 'info',
                title: 'Ошибка',
                message: err.response?.data || err.message
            });
        }
    };

    const handleDeleteSupport = (userId: number, fullName: string) => {
        setModal({
            isOpen: true,
            type: 'confirm',
            title: 'Удаление Support',
            message: `Вы уверены, что хотите удалить support "${fullName}"? Его роль будет сброшена до обычного пользователя.`,
            onConfirm: async () => {
                try {
                    await api.deleteSupport(userId);
                    setSupports(supports.filter(s => s.id !== userId));
                    setModal({ 
                        isOpen: true, 
                        type: 'info', 
                        title: 'Успешно', 
                        message: 'Support удалён' 
                    });
                } catch (err: any) {
                    setModal({
                        isOpen: true,
                        type: 'info',
                        title: 'Ошибка',
                        message: err.response?.data || err.message
                    });
                }
            }
        });
    };

    if (loading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }

    return (
        <div className={styles.support_manager}>
            {/* Заголовок с кнопкой */}
            <div className={styles.header_with_button}>
                <div>
                    <h2 className={styles.analytics_title}>👥 Support под вашим руководством</h2>
                    <p className={styles.analytics_subtitle}>Статистика работы каждого support</p>
                </div>
                <button
                    className={styles.add_button}
                    onClick={() => setShowAddSupport(true)}
                >
                    + Добавить support
                </button>
            </div>

            {/* Таблица производительности */}
            <div className={styles.performance_table_container}>
                {supports.length === 0 ? (
                    <div className={styles.empty_state}>
                        <p>Support пока нет</p>
                    </div>
                ) : (
                    <div className={styles.scroll_display}>
                        <table className={styles.performance_table}>
                            <thead>
                                <tr>
                                    <th className={styles.table_header}>Администратор</th>
                                    <th className={styles.table_header}>Категория</th>
                                    <th className={styles.table_header}>Решено</th>
                                    <th className={styles.table_header}>В работе</th>
                                    <th className={styles.table_header}>Среднее время</th>
                                    <th className={styles.table_header}>Статус</th>
                                    <th className={styles.table_header}>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {supports.map((support, index) => (
                                    <tr key={`${support.fullName}-${support.category}-${index}`}>
                                        <td className={styles.support_name_cell} data-label="Администратор">{support.fullName}</td>
                                        <td className={styles.support_category_cell} data-label="Категория">{support.category}</td>
                                        <td className={styles.stat_cell_decided} data-label="Решено">{support.decided}</td>
                                        <td className={styles.stat_cell_inwork} data-label="В работе">{support.inWork}</td>
                                        <td className={styles.time_cell} data-label="Среднее время">
                                            {support.averageTime ? `${support.averageTime.toFixed(1)} ч` : '—'}
                                        </td>
                                        <td data-label="Статус">
                                            <span className={`${styles.statusBadge} ${support.status.toLowerCase().includes('онлайн') || support.status.toLowerCase().includes('online') ? styles.statusOnline : styles.statusOffline}`}>
                                                {support.status}
                                            </span>
                                        </td>
                                        <td className={styles.action_cell} data-label="Действия">
                                            <button
                                                className={styles.delete_button_small}
                                                onClick={() => handleDeleteSupport(support.id, support.fullName)}
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Модальное окно добавления */}
            {showAddSupport && (
                <div className={styles.modal_overlay} onClick={() => setShowAddSupport(false)}>
                    <div className={styles.modal_content} onClick={e => e.stopPropagation()}>
                        <div className={styles.modal_header}>
                            <h3 className={styles.modal_title}>👥 Добавить Support</h3>
                            <p className={styles.modal_description}>
                                SUPPORT — отвечает за конкретные типы тикетов
                            </p>
                        </div>

                        <div className={styles.modal_body}>
                            <div className={styles.form_group}>
                                <label className={styles.form_label}>ID пользователя (Telegram ID)</label>
                                <input
                                    type="text"
                                    className={styles.form_input}
                                    placeholder="Например: 123456789"
                                    value={supportUserId}
                                    onChange={e => setSupportUserId(e.target.value)}
                                />
                            </div>

                            <div className={styles.form_group}>
                                <label className={styles.form_label}>Типы тикетов</label>
                                <p className={styles.form_description}>
                                    Выберите типы тикетов, за которые будет отвечать support
                                </p>
                                <div className={styles.types_grid}>
                                    {ticketTypes.map(type => (
                                        <label 
                                            key={type.code} 
                                            className={`${styles.type_checkbox} ${supportTypes.includes(type.code) ? styles.checked : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={supportTypes.includes(type.code)}
                                                onChange={() => {
                                                    if (supportTypes.includes(type.code)) {
                                                        setSupportTypes(supportTypes.filter(t => t !== type.code));
                                                    } else {
                                                        setSupportTypes([...supportTypes, type.code]);
                                                    }
                                                }}
                                            />
                                            <span className={styles.type_label}>{type.title}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.modal_footer}>
                            <button 
                                className={styles.cancel_button}
                                onClick={() => setShowAddSupport(false)}
                            >
                                Отмена
                            </button>
                            <button 
                                className={styles.submit_button}
                                onClick={handleAddSupport}
                            >
                                Назначить support
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Информационное модальное окно */}
            <Modal
                isOpen={modal.isOpen && modal.type === 'info'}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                type="info"
            >
                <p>{modal.message}</p>
            </Modal>

            {/* Подтверждающее модальное окно */}
            <Modal
                isOpen={modal.isOpen && modal.type === 'confirm'}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                type="confirm"
                onConfirm={modal.onConfirm}
            >
                <p>{modal.message}</p>
            </Modal>
        </div>
    );
};

export default SupportManager;
