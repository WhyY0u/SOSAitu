import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Menu, { type MenuItem } from './components/menu/Menu';
import styles from './style/Style.module.css';
import ContainerAnilition from './widget/containerAnalitic/ContainerAnalitic';
import AdministratorManager from './widget/adminManagement/AdministratorManager';
import LocationManagement from './widget/locationManagement/LocationManagement';
import MonthlyReport from './widget/monthlyReport/MonthlyReport';
import UserApiRepository from '@/data/repositories/user/remote/ApiUserRepository';
import type { StatsResponse } from '@/domain/repositories/user/UserRepository';

const Owner = () => {
    const [activeSection, setActiveSection] = useState<MenuItem>("analytics");
    const [stats, setStats] = useState<StatsResponse | null>(null);
    const [aiInsights, setAiInsights] = useState<string>('');
    const [monthlyReport, setMonthlyReport] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [generatingInsights, setGeneratingInsights] = useState(false);
    const [generatingReport, setGeneratingReport] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const api = new UserApiRepository();
                const statsData = await api.ownerStats();
                setStats(statsData);
            } catch (err) {
                console.error("Ошибка при загрузке статистики:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleGenerateInsights = async () => {
        setGeneratingInsights(true);
        try {
            const api = new UserApiRepository();
            const insights = await api.getOwnerAiInsights();
            setAiInsights(insights);
        } catch (err) {
            console.warn('AI insights недоступны:', err);
            setAiInsights('Не удалось сгенерировать аналитику');
        } finally {
            setGeneratingInsights(false);
        }
    };

    const handleGenerateReport = async () => {
        setGeneratingReport(true);
        try {
            const api = new UserApiRepository();
            const report = await api.getOwnerMonthlyReport();
            setMonthlyReport(report || 'Отчет временно недоступен');
        } catch (err) {
            console.warn('Отчет недоступен:', err);
            setMonthlyReport('Не удалось загрузить отчет');
        } finally {
            setGeneratingReport(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Загрузка...</div>;
    }

    return (
        <div className={`${styles.main_container}`}>
            <p className={`${styles.text_one}`}>Панель управление Владельца</p>
            <p className={`${styles.text_two}`}>Полная аналитика и управление системой SOSAitu</p>
            <Menu active={activeSection} onChange={setActiveSection} />

            {activeSection === "analytics" && stats && (
                <div className={styles.section}>
                    <div className={styles.section_header}>
                        <h3 className={styles.section_title}>📊 Статистика</h3>
                        <button
                            onClick={handleGenerateInsights}
                            disabled={generatingInsights}
                            className={`${styles.ai_button} ${generatingInsights ? styles.disabled : ''}`}
                        >
                            {generatingInsights ? '⏳ Генерация...' : '💡 Сгенерировать AI-аналитику'}
                        </button>
                    </div>
                    <ContainerAnilition stats={stats} admins={[]} />
                    {aiInsights && (
                        <div className={styles.ai_insights_container}>
                            <p className={styles.ai_insights_title}>Выводы ИИ по текущей ситуации</p>
                            <div className={styles.ai_insights_text}>
                                <ReactMarkdown>{aiInsights}</ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeSection === "report" && (
                <div className={styles.section}>
                    <div className={styles.section_header}>
                        <h3 className={styles.section_title}>📋 Отчет за месяц</h3>
                        <button
                            onClick={handleGenerateReport}
                            disabled={generatingReport}
                            className={`${styles.ai_button} ${styles.success} ${generatingReport ? styles.disabled : ''}`}
                        >
                            {generatingReport ? '⏳ Генерация...' : '🤖 Сгенерировать AI-отчет'}
                        </button>
                    </div>
                    <MonthlyReport report={monthlyReport || 'Нажмите кнопку для генерации отчета'} />
                </div>
            )}

            {activeSection === "admin" && <AdministratorManager />}
            {activeSection === "locations" && <LocationManagement />}
        </div>
    );
};

export default Owner;
