import SelectCards from "./components/selectCards/SelectCards"
import SelectControl from "./components/selectControl/SelectControl"
import SelectDinamic from "./components/selectDinamic/SelectDinamic"
import SelectInput from "./components/selectInput/SelectInput"
import SelectPyramid from "./components/selectPyramid/SelectPyramid"
import styles from "./styles/Styles.module.css"


const Admin = () => {
  return (
    <div className={styles.container_admin}>  
        <SelectControl />
        <SelectInput />
        <SelectCards />
        <SelectPyramid />
        <SelectDinamic />
    </div>
  )
}

export default Admin