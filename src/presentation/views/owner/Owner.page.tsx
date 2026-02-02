import { useState } from 'react';
import Menu, { type MenuItem } from './components/menu/Menu';
import styles from './style/Style.module.css'
import ContainerAnilition from './widget/containerAnalitic/ContainerAnalitic';
import AdminManagement from './widget/adminManagement/AdminManagement';



const Owner = () => {
    const [activeSection, setActiveSection] = useState<MenuItem>("analytics");

    return <>
        <div className={`${styles.main_container}`}>
            <p className={`${styles.text_one}`}>Панель управление Владельца</p>
            <p className={`${styles.text_two}`}>Полная аналитика и управление системой SOSAitu</p>
            <Menu active={activeSection} onChange={setActiveSection} />
            {activeSection === "analytics" && <ContainerAnilition />}
            {activeSection === "admin" && <AdminManagement />}
        </div>
    </>
}

export default Owner;
