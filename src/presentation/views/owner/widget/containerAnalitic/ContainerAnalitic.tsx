import type { AdminPerformanceDto, StatsResponse } from '@/domain/repositories/user/UserRepository';
import AllCategory from './components/allCategory/AllCategory';
import AllCategoryProcent from './components/allCategoryProcent/AllCategoryProcent';
import AllStats from './components/allStats/AllStats';
import styles from './style/Style.module.css'

interface ContainerAnilitionProps {
  stats: StatsResponse;
  admins: AdminPerformanceDto[];
}

const ContainerAnilition = ({ admins, stats }: ContainerAnilitionProps) => {
  return (
    <div className={styles.container_analitic}>
      <AllStats stats={stats} />
      <AllCategory countType={stats.countType} />
      <AllCategoryProcent countType={stats.countType} />
    </div>
  );
};

export default ContainerAnilition;