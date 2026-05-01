const statusStyles: Record<string, string> = {
    Draft: 'bg-[#F0EBE6] text-[#78716C] border-[#E8E3DD]',
    Sent: 'bg-[#FEF3E2] text-[#C08A5D] border-[#F5DFC0]',
    Viewed: 'bg-[#F0EBE6] text-[#3E2F2B] border-[#E0D6D1]',
    Approved: 'bg-[#F0EBE6] text-[#3E2F2B] border-[#D9D1C9]',
    Paid: 'bg-[#EDF5F1] text-[#6A9C89] border-[#D0E5DA]',
    Completed: 'bg-[#F0EBE6] text-[#1E1E1E] border-[#E8E3DD]',
};

export default function StatusBadge({ status }: { status: string }) {
    const style = statusStyles[status] || statusStyles.Draft;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${style}`}>
            {status}
        </span>
    );
}
