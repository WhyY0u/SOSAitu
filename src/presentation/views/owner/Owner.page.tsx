import { useEffect, useState } from 'react';
import Menu, { type MenuItem } from './components/menu/Menu';
import styles from './style/Style.module.css';
import ContainerAnilition from './widget/containerAnalitic/ContainerAnalitic';
import AdminManagement from './widget/adminManagement/AdminManagement';
import UserApiRepository from '@/data/repositories/user/remote/ApiUserRepository';
import type { AdminPerformanceDto, StatsResponse } from '@/domain/repositories/user/UserRepository';

const Owner = () => {
    const [activeSection, setActiveSection] = useState<MenuItem>("analytics");
    const [stats, setStats] = useState<StatsResponse | null>(null);
    const [admins, setAdmins] = useState<AdminPerformanceDto[]>([]);
    const [aiInsights, setAiInsights] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const api = new UserApiRepository();

                const statsData = await api.ownerStats();
                setStats(statsData);
                const adminsData = await api.getAdminPerformance();
                setAdmins(adminsData);

                const insights = await api.getOwnerAiInsights();
                setAiInsights(insights);

            } catch (err) {
                console.error("Ошибка при загрузке статистики:", err);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={`${styles.main_container}`}>
            <p className={`${styles.text_one}`}>Панель управление Владельца</p>
            <p className={`${styles.text_two}`}>Полная аналитика и управление системой SOSAitu</p>
            <Menu active={activeSection} onChange={setActiveSection} />

            {activeSection === "analytics" && aiInsights && (
                <div className={styles.ai_insights_container}>
                    <p className={styles.ai_insights_title}>Выводы ИИ по текущей ситуации</p>
                    <p className={styles.ai_insights_text}>{aiInsights}</p>
                </div>
            )}

            {activeSection === "analytics" && stats && (
                <ContainerAnilition admins={admins} stats={stats} />
            )}

            {activeSection === "admin" && <AdminManagement />}
        </div>
    );
};

export default Owner;
