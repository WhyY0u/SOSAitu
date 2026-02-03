import { FaSearch } from 'react-icons/fa';
import styles from './style/Style.module.css'

interface SearchComponentProps {
    value: string;
    onChange: (value: string) => void;
}

const SearchComponent = ({ value, onChange }: SearchComponentProps) => {
    return <>
        <label className={styles.searchWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input
                className={styles.input}
                placeholder="Поиск по тикетам..."
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </label>
    </>
}

export default SearchComponent;
