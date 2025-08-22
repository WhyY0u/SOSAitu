import { MdHeadset } from 'react-icons/md';
import styles from './style/Style.module.css'
import LoginBox from './component/loginBox/LoginBox';

const WellCome = () => {

    return (
        <div className={`${styles.container_wellcome}`}>
            <div className={`${styles.background_icon}`}>
                <MdHeadset size={50} color="white" />
            </div>
            <p className={`${styles.bot_name}`}>SOSAitu</p>
            <p className={`${styles.bot_description}`}>
                Удобный помощник для <br /> общения и решения вопросов
                просто,<br /> быстро и всегда под рукой
            </p>
            <LoginBox />

        </div>
    );
};

export default WellCome;
