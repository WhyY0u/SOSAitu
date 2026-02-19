import { Link } from 'react-router';
import styles from './styles/Style.module.css';

const NotFound = () => {
  return (
    <div className={styles.error_container}>
      <h1 className={styles.error_code}>404</h1>
      <h2 className={styles.error_title}>Страница не найдена</h2>
      <p className={styles.error_message}>
        Страница, которую вы ищете, не существует
      </p>
      <Link to="/" className={styles.error_button}>
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFound;
