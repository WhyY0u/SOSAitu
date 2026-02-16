import { FaClock, FaEnvelopeOpenText, FaUsers, FaUserShield, FaExclamationTriangle, FaSmile } from 'react-icons/fa';
import Stats from './components/stats/Stats';
import styles from './style/Style.module.css'


interface StatsData {
  totalTickets: number;
  adminsCount: number;
  avgResponseHours: number;
  usersCount: number;
  avgSatisfactionScore: number;
  problemTicketsCount: number;
}

interface AllStatsProps {
  stats: StatsData;
}

const AllStats = ({ stats }: AllStatsProps) => {
    return <>
        <div className={`${styles.container_all_stats}`}>

            <Stats
        bigText={stats.monthTickets.toString()}
        name='Всего обращений'
        description='за месяц'
        icon={<FaEnvelopeOpenText size={24} />}
      />

            <Stats
                bigText={stats.adminsCount.toString()}
                name='Администраторов'
                description='Активных сотрудников'
                icon={<FaUserShield size={24} />}
            />

            <Stats
                bigText={stats.avgResponseHours + 'ч'}
                name='Среднее время ответа'
                description='за неделю'
                icon={<FaClock size={24} />}
            />

            <Stats
                bigText={stats.usersCount.toString()}
                name='Пользователей'
                description='зарегистрировано'
                icon={<FaUsers size={24} />}
            />

            <Stats
                bigText={stats.avgSatisfactionScore.toFixed(1)}
                name='Средняя оценка'
                description='удовлетворенности заявителей'
                icon={<FaSmile size={24} />}
            />

            <Stats
                bigText={stats.problemTicketsCount.toString()}
                name='Проблемных обращений'
                description='просроченные и без ответа'
                icon={<FaExclamationTriangle size={24} />}
            />

        </div>
    </>
}

export default AllStats;