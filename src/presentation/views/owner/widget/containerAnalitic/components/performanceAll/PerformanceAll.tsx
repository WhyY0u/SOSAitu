import type { AdminPerformanceDto } from '@/domain/repositories/user/UserRepository';
import InfoComponent from './components/info/InfoComponent';
import styles from './style/Style.module.css';

interface PerformanceAllProps {
    admins: AdminPerformanceDto[];
}

const PerformanceAll: React.FC<PerformanceAllProps> = ({ admins }) => {
    return (
        <div className={styles.performance_container_all}>
            <p className={`${styles.lebel_1}`}>Производительность администраторов</p>
            <p className={`${styles.lebel_2}`}>Статистика работы каждого администратора</p>

            <div className={`${styles.scroll_display}`}>
                <div className={`${styles.level_one}`}>
                    <p className={`${styles.category_name_text}`}>Администратор</p>
                    <p className={`${styles.category_name_text}`}>Категория</p>
                    <p className={`${styles.category_name_text}`}>Решено</p>
                    <p className={`${styles.category_name_text}`}>В работе</p>
                    <p className={`${styles.category_name_text}`}>Среднее время</p>
                    <p className={`${styles.category_name_text}`}>Статус</p>
                </div>

                {admins.map((admin, index) => (
                    <InfoComponent
                        key={index}
                        fullname={admin.fullName}
                        category={admin.category}
                        decided={admin.decided}
                        at_work={admin.atWork}
                        average_time={admin.averageTime.toString()}
                        status={admin.status}
                    />
                ))}
            </div>
        </div>
    );
};

export default PerformanceAll;
