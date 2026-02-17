import ReactMarkdown from 'react-markdown';
import styles from './style/Style.module.css';

interface MonthlyReportProps {
    report: string;
}

const MonthlyReport = ({ report }: MonthlyReportProps) => {
    return (
        <div className={styles.monthly_report}>
            <h2 className={styles.title}>📊 Ежемесячный AI-отчет</h2>
            <div className={styles.report_content}>
                <ReactMarkdown>{report}</ReactMarkdown>
            </div>
        </div>
    );
};

export default MonthlyReport;
