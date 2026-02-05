import { useState, useEffect } from 'react';
import { FaUserCircle, FaUser } from 'react-icons/fa';
import styles from './styles/Style.module.css';
import { useNavigate } from 'react-router';
import UserApiRepository from './../../../../../data/repositories/user/remote/ApiUserRepository'
import DropDownMenu from '../dropDownMenu/DropDownMenu';
const LoginBox = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const [groups, setGroups] = useState<string[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const userRepo = new UserApiRepository();
    const trimmedName = name.trim();
    const isSubmitEnabled = trimmedName.length >= 5 && selected.length > 0;

    useEffect(() => {
        userRepo.getAllGroups().then(data => setGroups(data));
        const savedName = localStorage.getItem('name');
        if (savedName) setName(savedName);
    }, []);

    const handleLogin = async () => {
        if (isSubmitEnabled) {
            await userRepo.setNameAndTypes(trimmedName, selected);
            localStorage.setItem('name', trimmedName);
            navigate('/user');
        }
    };

    return (
        <div className={styles.login_box}>
            <FaUserCircle className={styles.avatar} size={60} />
            <p className={styles.text}>Вход</p>
            <p className={styles.text_small}>
                Укажите свои данные для продолжения
            </p>

            <div className={styles.input_group}>
                <FaUser />
                <input
                    placeholder="ФИО"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <DropDownMenu
                options={groups}
                placeholder="Выберите группы, к которой относитесь"
                onSelect={(value) => setSelected(Array.isArray(value) ? value : [value])}
                multiple={true}
            />

            <div className={styles.buttons}>
                <button
                    className={isSubmitEnabled ? styles.active : styles.disabled}
                    disabled={!isSubmitEnabled}
                    onClick={handleLogin}
                >
                    Вход
                </button>
            </div>
        </div>
    );
};

export default LoginBox;
