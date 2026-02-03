import { FaChartPie } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styles from './style/Style.module.css';
import type { TicketCategoryStat } from '@/domain/repositories/user/UserRepository';

interface AllCategoryProps {
  countType: TicketCategoryStat[];
}

const colors = [
  '#4F46E5', // LARGE_FAMILY
  '#6366F1', // SINGLE_PARENT
  '#818CF8', // PENSIONER
  '#A5B4FC', // PERSON_WITH_DISABILITY
  '#F59E0B', // LOW_INCOME
  '#F97316', // ORPHAN
  '#EF4444', // STUDENT_FROM_LOW_INCOME_FAMILY
  '#DC2626', // UNEMPLOYED
  '#16A34A', // ELDERLY_SINGLE
  '#059669', // REFUGEE_OR_REPATRIATE
  '#0EA5E9', // VICTIM_OF_DOMESTIC_VIOLENCE
  '#8B5CF6', // OTHER
];


const AllCategory = ({ countType }: AllCategoryProps) => {
  const sortedData = [...countType].sort((a, b) => b.count - a.count);

  return (
    <div className={styles.all_category}>
      <div className={styles.category_header}>
        <FaChartPie className={styles.icon} />
        <p>Обращения по категориям</p>
      </div>
      <p className={styles.subtitle}>Распределение обращений по направлениям</p>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sortedData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
            <XAxis dataKey="type" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" radius={[10, 10, 0, 0]}>
              {sortedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AllCategory;
