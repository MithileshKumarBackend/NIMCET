import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export function AdminDashboardPage() {
  const user = useSelector((state) => state.auth.user);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Admin console</p>
        <h1 className="mt-2 text-3xl font-black">Platform oversight</h1>
        <p className="mt-2 text-slate-500">Signed in as {user?.name || user?.email || 'admin'}.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            { label: 'Teachers', value: '—' },
            { label: 'Students', value: '—' },
            { label: 'Tests', value: '—' },
            { label: 'Questions', value: '—' },
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950/60">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 text-3xl font-black">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link className="rounded-full border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200" to="/manage/catalog">Manage catalog</Link>
          <Link className="rounded-full border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200" to="/manage/questions">Question bank</Link>
          <Link className="rounded-full border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200" to="/manage/tests">Test builder</Link>
        </div>
      </div>
    </section>
  );
}