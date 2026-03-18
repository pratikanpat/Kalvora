export default function StatusBadge({ status }: { status: string }) {
    let statusClass = 'status-draft';
    
    if (status === 'Approved') {
        statusClass = 'status-approved';
    } else if (status === 'Paid') {
        statusClass = 'status-approved';
    } else if (status === 'Completed') {
        statusClass = 'status-completed';
    } else if (status === 'Sent') {
        statusClass = 'status-sent';
    }

    return <span className={statusClass}>{status}</span>;
}

