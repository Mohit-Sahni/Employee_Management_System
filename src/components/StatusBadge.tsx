interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    inactive: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
    'on-leave': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    terminated: 'bg-red-500/15 text-red-400 border-red-500/20',
  };

  const labels: Record<string, string> = {
    active: 'Active',
    inactive: 'Inactive',
    'on-leave': 'On Leave',
    terminated: 'Terminated',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${styles[status] || styles.inactive}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'active' ? 'bg-emerald-400' :
        status === 'on-leave' ? 'bg-amber-400' :
        status === 'terminated' ? 'bg-red-400' : 'bg-slate-400'
      }`} />
      {labels[status] || status}
    </span>
  );
}
