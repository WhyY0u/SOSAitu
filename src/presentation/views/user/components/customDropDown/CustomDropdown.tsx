import { useState, useRef, useEffect } from "react";
import styles from "./style/Style.module.css";

interface CustomDropdownProps {
    options?: string[];
    placeholder?: string;
    onSelect: (value: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, placeholder = "Выберите...", onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<string>("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (option: string) => {
        setSelected(option);
        onSelect(option);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={styles.dropdown} ref={dropdownRef}>
            <div className={styles.dropdownHeader} onClick={toggleDropdown}>
                <span>{selected || placeholder}</span>
                <span className={`${styles.arrow} ${isOpen ? styles.open : ""}`}>▼</span>
            </div>
            <ul className={`${styles.dropdownList} ${isOpen ? styles.show : ""}`}>
                {options.map((option, index) => (
                    <li
                        key={index}
                        className={styles.dropdownItem}
                        onClick={() => handleSelect(option)}
                    >
                        {option}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CustomDropdown;
