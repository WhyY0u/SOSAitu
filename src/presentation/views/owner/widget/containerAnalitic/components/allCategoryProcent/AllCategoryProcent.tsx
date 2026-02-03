import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './style/Style.module.css';
import { FaChartPie } from 'react-icons/fa';
import type { TicketCategoryStat } from '@/domain/repositories/user/UserRepository';


interface AllCategoryProcentProps {
  countType: TicketCategoryStat[]; 
}

const COLORS = [
  '#4F46E5', '#6366F1', '#818CF8', '#A5B4FC',
  '#F59E0B', '#F97316', '#EF4444', '#DC2626',
  '#16A34A', '#059669', '#0EA5E9', '#8B5CF6'
];

const AllCategoryProcent = ({ countType }: AllCategoryProcentProps) => {
  const sortedData = [...countType].sort((a, b) => b.count - a.count);

  return (
    <div className={styles.all_category_procent_container}>
      <div className={styles.header}>
        <FaChartPie size={24} className={styles.icon} />
        <p>Распределение по типам</p>
      </div>
      <p className={styles.subtitle}>Процентное соотношение категорий</p>

      <div className={styles.chart_wrapper}>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={sortedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={90}
              dataKey="count"
              label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
            >
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.customLegend}>
        {sortedData.map((entry, index) => (
          <div key={index} className={styles.legendItem}>
            <span
              className={styles.legendColor}
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span>{entry.type} — {entry.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCategoryProcent;
