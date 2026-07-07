import { useSelector } from 'react-redux';

export function StudentDashboardPage() {
  const user = useSelector((state) => state.auth.user);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Student console</p>
        <h1 className="mt-2 text-3xl font-black">My test space</h1>
        <p className="mt-2 text-slate-500">Signed in as {user?.name || user?.email || 'student'}.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            { label: 'Upcoming Tests', value: '—' },
            { label: 'Live Tests', value: '—' },
            { label: 'Completed', value: '—' },
            { label: 'Weak Topics', value: '—' },
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950/60">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 text-3xl font-black">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}