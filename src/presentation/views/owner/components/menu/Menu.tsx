import { MdOutlineAnalytics } from 'react-icons/md';
import { FaUserShield, FaMapMarkedAlt } from 'react-icons/fa';
import { FaFileAlt } from 'react-icons/fa';
import styles from './style/Style.module.css';

export type MenuItem = "analytics" | "admin" | "locations" | "report";

interface MenuProps {
    active: MenuItem;
    onChange: (value: MenuItem) => void;
}

const Menu = ({ active, onChange }: MenuProps) => {

    return (
        <div className={styles.menu_container}>
            <button
                onClick={() => onChange("analytics")}
                className={`${styles.button} ${active === "analytics" ? styles.active : ""}`}
            >
                <MdOutlineAnalytics style={{ marginRight: "8px" }} />
                Аналитика
            </button>

            <button
                onClick={() => onChange("report")}
                className={`${styles.button} ${active === "report" ? styles.active : ""}`}
            >
                <FaFileAlt style={{ marginRight: "8px" }} />
                Отчет за месяц
            </button>

            <button
                onClick={() => onChange("admin")}
                className={`${styles.button} ${active === "admin" ? styles.active : ""}`}
            >
                <FaUserShield style={{ marginRight: "8px" }} />
                Управление администраторами
            </button>

            <button
                onClick={() => onChange("locations")}
                className={`${styles.button} ${active === "locations" ? styles.active : ""}`}
            >
                <FaMapMarkedAlt style={{ marginRight: "8px" }} />
                Регионы и города
            </button>
        </div>
    );
};

export default Menu;
