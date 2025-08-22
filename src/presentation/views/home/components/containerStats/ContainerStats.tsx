import { IoAlarmOutline, IoTicketOutline } from "react-icons/io5";
import TicketStats from "../ticketStats/TicketStats";
import { IoIosCheckmarkCircleOutline, IoIosInformationCircleOutline } from "react-icons/io";
import styles from './style/Style.module.css'

interface ContainerStatsProps {
    counts: {
        all: number;
        new: number;
        inProgress: number;
        closed: number;
    };
}

const ContainerStats = ({ counts }: ContainerStatsProps) => {
    return <div className={`${styles.container_ticket}`}>

        <TicketStats
            icon={<IoTicketOutline style={{ color: "#6065fa", fontSize: "28px" }} />}
            label="Всего тикетов"
            count={counts.all}
        />
        <TicketStats
            icon={<IoIosInformationCircleOutline style={{ color: "#3b82f6", fontSize: "28px" }} />}
            label="Новые"
            count={counts.new}
        />
        <TicketStats
            icon={<IoAlarmOutline style={{ color: "#f97316", fontSize: "28px" }} />}
            label="В работе"
            count={counts.inProgress}
        />
        <TicketStats
            icon={<IoIosCheckmarkCircleOutline style={{ color: "#22c55e", fontSize: "28px" }} />}
            label="Закрыте"
            count={counts.inProgress}
        />
    </div>
}

export default ContainerStats;