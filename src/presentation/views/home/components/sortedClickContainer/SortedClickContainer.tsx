import { useState } from 'react';
import styles from './style/Style.module.css'

export type SortBy = "date" | "status" | null;

interface SortedClickContainerProps {
    selected: SortBy;
    onChange: (value: SortBy) => void;
}

const SortedClickContainer = ({ selected, onChange }: SortedClickContainerProps) => {


    const [active, setActive] = useState('date');
    const handleActive = (value: string) => {
        setActive(value);
    };
    return <div>
        <div className={styles.sorted_click_container}>
            <button
                onClick={() => handleActive('date')}
                className={`${styles.sort_option} ${active == 'date' ? styles.selected : ''}`}
            >
                По дате
            </button>
            <button
                onClick={() => handleActive('status')}
                className={`${styles.sort_option} ${active == 'status' ? styles.selected : ''}`}
            >
                По статусу
            </button>
        </div>
    </div>
}

export default SortedClickContainer;