import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './styles/Style.module.css';
import type { CityAdminAnalyticsResponse } from '@/domain/repositories/city_admin/CityAdminRepository';
import CityAdminApiRepository from '@/data/repositories/city_admin/remote/ApiCityAdminRepository';

type ActiveSection = 'analytics' | 'report' | 'supervisors';

const CityAdmin = () => {
    const [activeSection, setActiveSection] = useState<ActiveSection>('analytics');
    const [analytics, setAnalytics] = useState<CityAdminAnalyticsResponse | null>(null);
    const [report, setReport] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [generatingReport, setGeneratingReport] = useState(false);
    const [supervisors, setSupervisors] = useState<any[]>([]);
    const [showAddSupervisor, setShowAddSupervisor] = useState(false);
    const [supervisorUserId, setSupervisorUserId] = useState<string>('');
    const [supervisorTypes, setSupervisorTypes] = useState<string[]>([]);
    const [ticketTypes, setTicketTypes] = useState<{code: string, title: string}[]>([]);

    const api = new CityAdminApiRepository();

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Loading analytics...');
                const data = await api.getAnalytics();
                console.log('Analytics loaded:', data);
                setAnalytics(data);
                
                console.log('Loading supervisors...');
                const supervisorsData = await api.getSupervisors();
                console.log('Supervisors loaded:', supervisorsData);
                setSupervisors(supervisorsData);
                
                console.log('Loading ticket types...');
                const typesData = await api.getTicketTypes();
                console.log('Ticket types loaded:', typesData);
                setTicketTypes(typesData);
            } catch (err) {
                console.error('Ошибка при загрузке аналитики:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleGenerateReport = async () => {
        setGeneratingReport(true);
        try {
            const reportData = await api.getAiInsights();
            setReport(reportData);
        } catch (err) {
            console.warn('AI отчет недоступен:', err);
            setReport('Не удалось сгенерировать отчет');
        } finally {
            setGeneratingReport(false);
        }
    };

    const handleAddSupervisor = async () => {
        if (!supervisorUserId || supervisorTypes.length === 0) {
            alert('Введите ID пользователя и выберите типы тикетов');
            return;
        }

        try {
            await api.addSupervisor(parseInt(supervisorUserId), supervisorTypes);
            setShowAddSupervisor(false);
            setSupervisorUserId('');
            setSupervisorTypes([]);
            const supervisorsData = await api.getSupervisors();
            setSupervisors(supervisorsData);
        } catch (err: any) {
            alert(err.response?.data || 'Ошибка при добавлении supervisor');
        }
    };

    if (loading) {
        return <div className={styles.main_container}>Загрузка...</div>;
    }

    return (
        <div className={styles.main_container}>
            <p className={styles.text_one}>Панель администратора города</p>
            <p className={styles.text_two}>Управление и аналитика по вашему городу</p>

            <div className={styles.menu}>
                <button
                    className={`${styles.menu_button} ${activeSection === 'analytics' ? styles.active : ''}`}
                    onClick={() => setActiveSection('analytics')}
                >
                    📊 Аналитика
                </button>
                <button
                    className={`${styles.menu_button} ${activeSection === 'report' ? styles.active : ''}`}
                    onClick={() => setActiveSection('report')}
                >
                    📋 AI-отчет
                </button>
                <button
                    className={`${styles.menu_button} ${activeSection === 'supervisors' ? styles.active : ''}`}
                    onClick={() => setActiveSection('supervisors')}
                >
                    👥 Supervisors
                </button>
            </div>

            {activeSection === 'analytics' && analytics && (
                <div className={styles.analytics_card}>
                    <div className={styles.card_header}>
                        <h2 className={styles.analytics_title}>📊 Статистика по городу</h2>
                    </div>

                    <div className={styles.stats_grid}>
                        <div className={styles.stat_card}>
                            <div className={styles.stat_icon}>📬</div>
                            <div className={styles.stat_label}>Всего обращений</div>
                            <div className={styles.stat_value}>{analytics.totalTickets}</div>
                        </div>
                        <div className={styles.stat_card}>
                            <div className={styles.stat_icon}>📅</div>
                            <div className={styles.stat_label}>За месяц</div>
                            <div className={styles.stat_value}>{analytics.ticketsMonth}</div>
                        </div>
                        <div className={styles.stat_card}>
                            <div className={styles.stat_icon}>⚠️</div>
                            <div className={styles.stat_label}>Проблемных</div>
                            <div className={styles.stat_value}>{analytics.problemTickets}</div>
                        </div>
                        <div className={styles.stat_card}>
                            <div className={styles.stat_icon}>⏱️</div>
                            <div className={styles.stat_label}>Ср. время ответа</div>
                            <div className={styles.stat_value}>{analytics.avgResponseTime} ч</div>
                        </div>
                        <div className={styles.stat_card}>
                            <div className={styles.stat_icon}>⭐</div>
                            <div className={styles.stat_label}>Удовлетворённость</div>
                            <div className={styles.stat_value}>{analytics.satisfactionScore}</div>
                        </div>
                    </div>

                    {analytics.categoryStats && analytics.categoryStats.length > 0 && (
                        <div className={styles.category_stats}>
                            <h3 className={styles.category_title}>📂 Распределение по категориям</h3>
                            <div className={styles.category_grid}>
                                {analytics.categoryStats.map((stat) => (
                                    <div key={stat.type} className={styles.category_item}>
                                        <span className={styles.category_name}>{stat.type}</span>
                                        <span className={styles.category_count}>{stat.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeSection === 'report' && (
                <div className={styles.analytics_card}>
                    <div className={styles.card_header}>
                        <h2 className={styles.analytics_title}>📋 AI-отчет за месяц</h2>
                        <button
                            onClick={handleGenerateReport}
                            disabled={generatingReport}
                            className={`${styles.ai_button} ${generatingReport ? styles.disabled : ''}`}
                        >
                            {generatingReport ? '⏳ Генерация...' : '🤖 Сгенерировать отчет'}
                        </button>
                    </div>
                    {report ? (
                        <div className={styles.ai_report}>
                            <ReactMarkdown>{report}</ReactMarkdown>
                        </div>
                    ) : (
                        <div className={styles.empty_state}>
                            Нажмите кнопку для генерации AI-отчета
                        </div>
                    )}
                </div>
            )}

            {activeSection === 'supervisors' && (
                <div className={styles.analytics_card}>
                    <div className={styles.card_header}>
                        <h2 className={styles.analytics_title}>👥 Supervisors</h2>
                        <button
                            className={styles.add_button}
                            onClick={() => setShowAddSupervisor(true)}
                        >
                            + Добавить supervisor
                        </button>
                    </div>
                    <div className={styles.supervisors_grid}>
                        {supervisors.length === 0 ? (
                            <div className={styles.empty_state}>
                                <p>Supervisors пока нет</p>
                            </div>
                        ) : (
                            supervisors.map((supervisor) => (
                                <div key={supervisor.id} className={styles.supervisor_card}>
                                    <div className={styles.supervisor_header}>
                                        <div className={styles.supervisor_avatar}>
                                            {supervisor.fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                                        </div>
                                        <div className={styles.supervisor_info}>
                                            <h3 className={styles.supervisor_name}>{supervisor.fullName}</h3>
                                            <div className={styles.supervisor_types}>{supervisor.types}</div>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.supervisor_stats}>
                                        <div className={styles.supervisor_stat_item}>
                                            <span className={styles.supervisor_stat_icon}>📬</span>
                                            <div>
                                                <div className={styles.supervisor_stat_label}>Всего</div>
                                                <div className={styles.supervisor_stat_value}>{supervisor.totalTickets}</div>
                                            </div>
                                        </div>
                                        <div className={styles.supervisor_stat_item}>
                                            <span className={styles.supervisor_stat_icon}>📅</span>
                                            <div>
                                                <div className={styles.supervisor_stat_label}>За месяц</div>
                                                <div className={styles.supervisor_stat_value}>{supervisor.ticketsMonth}</div>
                                            </div>
                                        </div>
                                        <div className={styles.supervisor_stat_item}>
                                            <span className={styles.supervisor_stat_icon}>⚠️</span>
                                            <div>
                                                <div className={styles.supervisor_stat_label}>Проблемных</div>
                                                <div className={styles.supervisor_stat_value_problem}>{supervisor.problemTickets}</div>
                                            </div>
                                        </div>
                                        <div className={styles.supervisor_stat_item}>
                                            <span className={styles.supervisor_stat_icon}>⏱️</span>
                                            <div>
                                                <div className={styles.supervisor_stat_label}>Время</div>
                                                <div className={styles.supervisor_stat_value}>{supervisor.avgResponseTime} ч</div>
                                            </div>
                                        </div>
                                        <div className={styles.supervisor_stat_item}>
                                            <span className={styles.supervisor_stat_icon}>⭐</span>
                                            <div>
                                                <div className={styles.supervisor_stat_label}>Рейтинг</div>
                                                <div className={styles.supervisor_stat_value}>{supervisor.satisfactionScore}</div>
                                            </div>
                                        </div>
                                        <div className={styles.supervisor_stat_item}>
                                            <span className={styles.supervisor_stat_icon}>👥</span>
                                            <div>
                                                <div className={styles.supervisor_stat_label}>Support</div>
                                                <div className={styles.supervisor_stat_value}>{supervisor.supportCount}</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.supervisor_footer}>
                                        <span className={`${styles.supervisor_status} ${supervisor.status === 'Онлайн' ? styles.online : ''}`}>
                                            ● {supervisor.status}
                                        </span>
                                        <button
                                            className={styles.delete_button}
                                            onClick={async () => {
                                                if (confirm(`Удалить supervisor ${supervisor.fullName}?`)) {
                                                    await api.deleteSupervisor(supervisor.id);
                                                    setSupervisors(supervisors.filter(s => s.id !== supervisor.id));
                                                }
                                            }}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {showAddSupervisor && (
                <div className={styles.modal_overlay} onClick={() => setShowAddSupervisor(false)}>
                    <div className={styles.modal_content} onClick={e => e.stopPropagation()}>
                        <div className={styles.supervisor_modal_header}>
                            <h3 className={styles.supervisor_modal_title}>🏢 Добавить Supervisor</h3>
                            <p className={styles.supervisor_modal_description}>
                                SUPERVISOR — отвечает за определённые типы тикетов, может добавлять support
                            </p>
                        </div>
                        
                        <div className={styles.supervisor_modal_body}>
                            <div className={styles.form_group}>
                                <label className={styles.form_label}>
                                    ID пользователя <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="number"
                                    className={styles.form_input}
                                    placeholder="Например: 5"
                                    value={supervisorUserId}
                                    onChange={e => setSupervisorUserId(e.target.value)}
                                />
                            </div>

                            <div className={styles.form_group}>
                                <label className={styles.form_label}>
                                    Типы тикетов <span className={styles.required}>*</span>
                                </label>
                                <p className={styles.form_description}>Выберите типы тикетов, за которые будет отвечать supervisor</p>
                                <div className={styles.checkbox_group}>
                                    {ticketTypes.map((type) => (
                                        <label key={type.code} className={styles.checkbox_label}>
                                            <input
                                                type="checkbox"
                                                checked={supervisorTypes.includes(type.code)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSupervisorTypes([...supervisorTypes, type.code]);
                                                    } else {
                                                        setSupervisorTypes(supervisorTypes.filter(t => t !== type.code));
                                                    }
                                                }}
                                            />
                                            <span className={styles.checkbox_text}>{type.title}</span>
                                            <span className={styles.checkbox_code}>{type.code}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.modal_actions}>
                                <button
                                    className={styles.cancel_button}
                                    onClick={() => setShowAddSupervisor(false)}
                                >
                                    Отмена
                                </button>
                                <button
                                    className={styles.submit_button}
                                    onClick={handleAddSupervisor}
                                >
                                    Назначить supervisor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CityAdmin;
