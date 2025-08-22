import styles from './styles/Style.module.css'


const SelectCards = () => {
  const index = [
    {title:"Всего обращений", number:"631", text:"+12% за месяц"},
    {title:"Администраторов", number:"631", text:"Активных сотрудников"},
    {title:"Средняя время", number:"631", text:"-15% улучшение"},
    {title:"Удовлетворенность", number:"631", text:"Рейтинг клиентов"},]
  return (
    <div className={styles.containerBox}>
      {index.map((item, key) =>(
        <div key={key} className={styles.boxCard}>
            <span>{item.title}</span>
            <span>{item.number}</span>
            <span>{item.text}</span>
        </div>
      ))}
    </div>
  )
}

export default SelectCards