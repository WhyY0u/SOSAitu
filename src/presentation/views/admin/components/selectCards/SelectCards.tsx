import { color } from 'framer-motion'
import styles from './styles/Style.module.css'


const SelectCards = () => {
  const index = [
    {title:"Всего обращений", number:"631",percent:"+12%", text:"за месяц", color:"#2563EB"},   // синий
    {title:"Администраторов", number:"631", text:"Активных сотрудников", color:"#16A34A"}, // зеленый
    {title:"Средняя время", number:"631",percent:"15%", text:"улучшение", color:"#DC2626"},   // красный
    {title:"Удовлетворенность", number:"631", text:"Рейтинг клиентов", color:"#16A34A"}, // фиолетовый
  ]
  return (
    <div className={styles.containerBox}>
      {index.map((item, key) =>(
        <div key={key} className={styles.boxCard}>
            <span>{item.title}</span>
            <span className={styles.spanNumber} style={{color: item.color}}>{item.number}</span>
            <span className={styles.spanBox}> <p  style={{color: item.color}}>{item.percent}</p>{item.text}</span>
        </div>
      ))}
    </div>
  )
}

export default SelectCards