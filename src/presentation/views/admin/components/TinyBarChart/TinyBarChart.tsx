 
import { BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import styles from "./styles/Styles.module.css"

const data = [
  { name: "Пожилые", uv: 4000 },
  { name: "Жилье", uv: 3000 },
  { name: "Льготы", uv: 2500 },
  { name: "Здоровье", uv: 2000 },
  { name: "Семьи", uv: 1500 },
  { name: "", uv: 1000 },
  { name: "Другое", uv: 500 },
];

const Example = () => {
  return (
    <ResponsiveContainer width="100%" height={300} className={styles.barBorder} >
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="uv" fill="#55AAFF" radius={[5, 5, 0, 0]}  />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Example;
