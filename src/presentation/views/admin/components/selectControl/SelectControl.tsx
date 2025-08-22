import styles from './styles/Style.module.css'

const SelectControl = () => {
  return (
    <div className={styles.container_admin}>
        <div className={styles.container_title}>
            <span className={styles.title}>Панель управления владельца</span>
            <span className={styles.text}>Полная аналитика и управление системой SOSAitu</span>
        </div>
    </div>
  )
}

export default SelectControl