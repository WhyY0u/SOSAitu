import styles from './style/Style.module.css';

interface MenuProps {
    position?: 'left' | 'right' | 'bottom';
}

const Menu = ({ position = 'bottom' }: MenuProps) => {

    return (
        <nav className={`${styles.menu} ${styles[position]}`}>
            <button>Главная</button>
            <button>Магазин</button>
            <button>Профиль</button>
        </nav>
    );
};

export default Menu;
