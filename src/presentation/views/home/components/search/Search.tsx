import { FaSearch } from 'react-icons/fa';
import styles from './style/Style.module.css'

const SearchComponent = () => {
    return <>
        <label className={styles.searchWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input
                className={styles.input}
                placeholder="Поиск по тикетам..."
            />
        </label>
    </>
}

export default SearchComponent;