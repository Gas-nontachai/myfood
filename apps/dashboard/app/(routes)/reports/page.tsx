const weeks = [
  { week: 'Week 42', covers: 1234, aov: '$48.10' },
  { week: 'Week 41', covers: 1103, aov: '$46.75' }
];

export default function ReportsPage() {
  return (
    <section className="space-y-4">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Reporting</p>
        <h2 className="text-2xl font-semibold text-slate-900">Weekly performance</h2>
      </header>
      <div className="overflow-hidden rounded-2xl border bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Week</th>
              <th className="px-4 py-3">Covers</th>
              <th className="px-4 py-3">Average order value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {weeks.map((week) => (
              <tr key={week.week}>
                <td className="px-4 py-3 font-medium text-slate-900">{week.week}</td>
                <td className="px-4 py-3">{week.covers}</td>
                <td className="px-4 py-3">{week.aov}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
