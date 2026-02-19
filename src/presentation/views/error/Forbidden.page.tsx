import { Link } from 'react-router';
import styles from './styles/Style.module.css';

const Forbidden = () => {
  return (
    <div className={styles.error_container}>
      <h1 className={styles.error_code}>403</h1>
      <h2 className={styles.error_title}>Доступ запрещен</h2>
      <p className={styles.error_message}>
        У вас нет прав для доступа к этой странице
      </p>
      <Link to="/" className={styles.error_button}>
        Вернуться на главную
      </Link>
    </div>
  );
};

export default Forbidden;
