import { useState, useEffect } from 'react';
import { FaUserCircle, FaUser } from 'react-icons/fa';
import styles from './styles/Style.module.css';
import { useNavigate } from 'react-router';
import UserApiRepository from './../../../../../data/repositories/user/remote/ApiUserRepository'

const LoginBox = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const userRepo = new UserApiRepository();
    const trimmedName = name.trim();
    const isSubmitEnabled = trimmedName.length >= 5;

    const handleLogin = async () => {
        if (isSubmitEnabled) {
            await userRepo.setName(trimmedName);
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
