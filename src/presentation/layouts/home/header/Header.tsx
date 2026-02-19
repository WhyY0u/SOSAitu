
import { MdHeadset } from 'react-icons/md';
import styles from './style/Style.module.css'
import { useEffect, useState } from 'react';
import { type User } from '@/domain/entities/user/User';
import { FaUserCircle } from "react-icons/fa";
import UserApiRepository from '@/data/repositories/user/remote/ApiUserRepository';

const roleLabelMap: Record<string, string> = {
    ROLE_USER: "Пользователь",
    ROLE_ADMINISTATOR: "Администратор",
    ROLE_OWNER: "Владелец",
    ROLE_OBLASTI_ADMINISTATOR: "Администратор Области",
    ROLE_CITY_ADMINISTRATOR: "Администратор Города",
    ROLE_SUPPORT: "Поддержка",
};

const Header = () => {
    const me = new UserApiRepository();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        me.getMe().then(res => setUser(res));
    }, []);

    const localName = localStorage.getItem("name")?.trim();
    const displayName = user?.fullName?.trim() || localName || "Пользователь";
    const displayRole = user?.role ? roleLabelMap[user.role] ?? user.role : "";

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
                        <p className={styles.user_role}>{displayName}</p>
                        <p className={styles.user_id}>ID: {user?.id ?? "..."}{displayRole ? ` • ${displayRole}` : ""}</p>
                    </div>
                </div>
            </div>


        </>
    );
};

export default Header;
