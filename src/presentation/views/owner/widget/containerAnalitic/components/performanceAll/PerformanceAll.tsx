import InfoComponent from './components/info/InfoComponent';
import styles from './style/Style.module.css'

const PerformanceAll = () => {
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
                <InfoComponent fullname='Анна Иванова' category='Ветеран ВОВ' decided={14} at_work={3} average_time='2.5' status='Онлайн' />
                <InfoComponent fullname='Петр Смирнов' category='Кандас' decided={5} at_work={3} average_time='5.5' status='Оффлайн' />
                <InfoComponent fullname='Мария Козлова' category='Ветеран боевых действий' decided={35} at_work={0} average_time='1.5' status='Оффлайн' />

            </div>
        </div>
    )
}

export default PerformanceAll;
