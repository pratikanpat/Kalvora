export default function StatusBadge({ status }: { status: string }) {
    const statusClass =
        status === 'Approved'
            ? 'status-approved'
            : status === 'Sent'
                ? 'status-sent'
                : 'status-draft';

    return <span className={statusClass}>{status}</span>;
}
