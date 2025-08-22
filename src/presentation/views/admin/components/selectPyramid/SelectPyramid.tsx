import PieExample from "../PieChartWithCustomizedLabel/PieChartWithCustomizedLabel";
import Example from "../TinyBarChart/TinyBarChart";
import styles from "./styles/Style.module.css"
import { IoIosTrendingUp } from "react-icons/io";

const SelectPyramid = () => {
  return (
    <div className={styles.containerPyramid}>
      
      {/* Left */}
      <div className={styles.containerDiag}>
        <div className={styles.boxPyramidText}>

          <span className={styles.spanTitle}><IoIosTrendingUp />{" "}Обращения по категориям</span>
          <span className={styles.spanText}>Распределение обращений по направлениям</span>
        </div>
        <div className={styles.boxExample}>
          <Example />
        </div>
      </div>

      {/* Right */}
      <div className={styles.containerDiag}>
        <div className={styles.boxPyramidText}>
          <span className={styles.spanTitle}>Обращения по категориям</span>
          <span className={styles.spanText}>Распределение обращений по направлениям</span>
        </div>
        <div>
          <PieExample />
        </div>
      </div>
    </div>
  )
}

export default SelectPyramid
