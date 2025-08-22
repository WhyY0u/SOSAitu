import SelectCards from "./components/selectCards/SelectCards"
import SelectControl from "./components/selectControl/SelectControl"
import SelectInput from "./components/selectInput/SelectInput"
import styles from "./styles/Styles.module.css"


const Admin = () => {
  return (
    <div className={styles.container_admin}>  
        <SelectControl />
        <SelectInput />
        <SelectCards />
    </div>
  )
}

export default Admin