import type { ReactNode } from 'react';
import styles from './style/Style.module.css'


type BackgroundProps = {
    children: ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ children }) => {
    return (
        <div className={styles.background} >
            {children}
        </div>
    );
};


export default Background;
