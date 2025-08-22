import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import styles from "./styles/Styles.module.css"

const data = [
  { name: 'Пн', uv: 10 },
  { name: 'Вт', uv: 30 },
  { name: 'Ср', uv: 50 },
  { name: 'Чт', uv: 70 },
  { name: 'Пт', uv: 20 },
  { name: 'Сб', uv: 40 },
  { name: 'Вс', uv: 60 },
];

export default function Example() {
  return (
    <div className={styles.boxContainer}>
      <div className={styles.spanBox}>
        <span className={styles.spanExample}>Динамика по дням недели</span>
        <span className={styles.textExample}>Количество новых обращений за полслуднюю неделю</span>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
          />
          <YAxis
            ticks={[0, 20, 40, 60, 80]}

          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="uv"
            stroke="#55AAFF"
            strokeWidth={2}

          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
