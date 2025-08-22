
import { MdHeadset } from 'react-icons/md';
import styles from './style/Style.module.css'
import { useEffect, useState } from 'react';
import { type User } from '@/domain/entities/user/User';
import { FaUserCircle } from "react-icons/fa";
import UserApiRepository from '@/data/repositories/user/memory/InMemoryUserRepository';
const Header = () => {
    const me = new UserApiRepository();
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        me.getMe().then(res => setUser(res));
    }, []);

    return (
        <>
            <div className={styles.header}>
                <div className={styles.header_left}>
                    <div className={styles.header_icon}>
                        <MdHeadset size={25} color="white" />
                    </div>
                    <div className={styles.block_text}>
                        <p className={styles.header_title}>SOSAitu</p>
                        <p className={styles.header_subtitle}>Спасаем жизни</p>
                    </div>
                </div>

                <div className={styles.user_info}>
                    <FaUserCircle className={styles.user_icon} />
                    <div className={styles.user_text}>
                        <p className={styles.user_role}>{user?.role}</p>
                        <p className={styles.user_id}>ID:{user?.id}</p>
                    </div>
                </div>
            </div>


        </>
    );
};

export default Header;
