import type { AdminPerformanceDto } from '@/domain/repositories/user/UserRepository';
import styles from './style/Style.module.css';

interface PerformanceAllProps {
    admins: AdminPerformanceDto[];
}

const PerformanceAll: React.FC<PerformanceAllProps> = ({ admins }) => {
    const formatAverageTime = (value: number) => {
        if (value <= 0) return '—';
        return `${value} ч`;
    };

    const getStatusClass = (status: string) => {
        const normalized = status.trim().toLowerCase();
        return normalized === 'online' || normalized === 'онлайн'
            ? styles.statusOnline
            : styles.statusOffline;
    };

    return (
        <div className={styles.performance_container_all}>
            <p className={`${styles.lebel_1}`}>Производительность администраторов</p>
            <p className={`${styles.lebel_2}`}>Статистика работы каждого администратора</p>

            <div className={styles.scroll_display}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.category_name_text}>Администратор</th>
                            <th className={styles.category_name_text}>Категория</th>
                            <th className={styles.category_name_text}>Решено</th>
                            <th className={styles.category_name_text}>В работе</th>
                            <th className={styles.category_name_text}>Среднее время</th>
                            <th className={styles.category_name_text}>Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((admin, index) => (
                            <tr key={`${admin.fullName}-${admin.category}-${index}`}>
                                <td className={styles.adminName}>{admin.fullName}</td>
                                <td>{admin.category}</td>
                                <td>{admin.decided}</td>
                                <td>{admin.atWork}</td>
                                <td>{formatAverageTime(admin.averageTime)}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${getStatusClass(admin.status)}`}>
                                        {admin.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {admins.length === 0 && (
                    <p className={styles.emptyText}>Пока нет данных по производительности администраторов.</p>
                )}
            </div>
        </div>
    );
};

export default PerformanceAll;
