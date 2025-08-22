
import styles from "./styles/Style.module.css"
import { MdOutlineAnalytics } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";

const SelectInput = () => {
  return (
    <div className={styles.containerInput}>
      <div className={styles.inputAnalitic}>
        <MdOutlineAnalytics />
        <span>Аналитика</span>
      </div>
      <div className={styles.inputAnalitic}>
        <IoSettingsOutline />
        <span>управление администраторами</span>
      </div>
    </div>
  )
}

export default SelectInput