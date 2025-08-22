import { useState, useEffect } from 'react';
import { FaUserCircle, FaUser } from 'react-icons/fa';
import styles from './styles/Style.module.css';
import { useNavigate } from 'react-router';
import InMemoryUserRepository from './../../../../../data/repositories/user/memory/InMemoryUserRepository'
const LoginBox = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const userRepo = new InMemoryUserRepository();
    useEffect(() => {
        const savedName = localStorage.getItem('name');
        if (savedName) setName(savedName);
    }, []);

    const handleLogin = () => {
        if (name.trim()) {
            //userRepo.register();
            localStorage.setItem('name', name.trim());
            navigate('/home');
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
                    className={name.trim() ? styles.active : styles.disabled}
                    disabled={!name.trim()}
                    onClick={handleLogin}
                >
                    Вход
                </button>
            </div>
        </div>
    );
};

export default LoginBox;
