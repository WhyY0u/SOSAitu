import styles from "./style/Style.module.css";
import SearchComponent from "../search/Search";
import SortedClickContainer, { type SortBy } from "../sortedClickContainer/SortedClickContainer";
import SortedStatusContainer, { type TicketStatusFilter } from "../sortedStatusContainer/SortedStatusContainer";


interface SortedContainerProps {
    selectedStatus: TicketStatusFilter;
    onStatusChange: (status: TicketStatusFilter) => void;
    sortBy: SortBy;
    onSortChange: (sort: SortBy) => void;
    counts: {
        all: number;
        new: number;
        inProgress: number;
        closed: number;
    };
}

const SortedContainer = ({ selectedStatus, onStatusChange, sortBy, onSortChange, counts }: SortedContainerProps) => {
    return (
        <div className={styles.sorted_container}>
            <SearchComponent />
            <SortedClickContainer selected={sortBy} onChange={onSortChange} />
            <SortedStatusContainer selected={selectedStatus} onSelect={onStatusChange} all={counts.all} closed={counts.closed} inProgress={counts.inProgress} newCount={counts.new} />
        </div>
    );
};

export default SortedContainer;
