import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './styles/Style.module.css';
import type { SupervisorAnalytics, SupportPerformance } from '@/domain/repositories/supervisor/SupervisorRepository';
import SupervisorApiRepository from '@/data/repositories/supervisor/remote/ApiSupervisorRepository';
import SupportManager from './widget/supportManager/SupportManager';

type ActiveSection = 'analytics' | 'report' | 'supports';

const Supervisor = () => {
    const [activeSection, setActiveSection] = useState<ActiveSection>('analytics');
    const [analytics, setAnalytics] = useState<SupervisorAnalytics | null>(null);
    const [report, setReport] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [generatingReport, setGeneratingReport] = useState(false);

    const api = new SupervisorApiRepository();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const analyticsData = await api.getAnalytics();
                setAnalytics(analyticsData);
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

    if (loading) {
        return <div className={styles.main_container}>Загрузка...</div>;
    }

    return (
        <div className={styles.main_container}>
            <p className={styles.text_one}>Панель супервизора</p>
            <p className={styles.text_two}>Управление support и аналитика по вашим типам тикетов</p>

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
                    className={`${styles.menu_button} ${activeSection === 'supports' ? styles.active : ''}`}
                    onClick={() => setActiveSection('supports')}
                >
                    👥 Support
                </button>
            </div>

            {activeSection === 'analytics' && analytics && (
                <div className={styles.analytics_card}>
                    <div className={styles.card_header}>
                        <h2 className={styles.analytics_title}>📊 Статистика по вашим типам тикетов</h2>
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
                </div>
            )}

            {activeSection === 'report' && (
                <div className={styles.analytics_card}>
                    <div className={styles.card_header}>
                        <h2 className={styles.analytics_title}>📋 AI-отчет</h2>
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

            {activeSection === 'supports' && (
                <SupportManager />
            )}
        </div>
    );
};

export default Supervisor;
