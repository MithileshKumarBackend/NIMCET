import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api, getApiErrorMessage } from '../lib/api';

const features = [
	'RBAC for admin, teacher, and student workflows',
	'Reusable question bank and test builder foundation',
	'Secure JWT refresh rotation with protected cookies',
	'Analytics-ready schemas and audit logging',
];

const highlights = [
	{ label: '3', value: 'roles' },
	{ label: '7', value: 'phase roadmap' },
	{ label: '1', value: 'shared CRUD layer' },
];

async function fetchHealth() {
	const { data } = await api.get('/health');
	return data.data;
}

export function LandingPage() {
	const { data, error, isLoading } = useQuery({
		queryKey: ['health'],
		queryFn: fetchHealth,
		staleTime: 30_000,
	});

	return (
		<section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
			<div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80">
				<div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-600 via-sky-500 to-indigo-500" />
				<p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-brand-600">
					Online Examination SaaS
				</p>
				<h1 className="max-w-2xl text-4xl font-black tracking-tight sm:text-6xl">
					Run secure, scalable exams with a clean operator workflow.
				</h1>
				<p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
					A production-ready MERN platform for question banks, test creation, student attempts, audit logs, and
					role-based access.
				</p>

				<div className="mt-8 flex flex-wrap gap-3">
					<Link className="rounded-full bg-brand-600 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:-translate-y-0.5" to="/register">
						Get started
					</Link>
					<Link className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" to="/login">
						Sign in
					</Link>
				</div>

				<div className="mt-8 grid gap-3 sm:grid-cols-3">
					{highlights.map((item) => (
						<div key={item.value} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
							<p className="text-2xl font-black text-slate-900 dark:text-white">{item.label}</p>
							<p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-500">{item.value}</p>
						</div>
					))}
				</div>

				<div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
					<p className="font-semibold">API health</p>
					<p className="mt-2 text-slate-600 dark:text-slate-300">
						{isLoading ? 'Checking service status...' : error ? getApiErrorMessage(error, 'API unavailable') : `Healthy since ${new Date(data.timestamp).toLocaleString()}`}
					</p>
				</div>
			</div>

			<div className="grid gap-4">
				<div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-7 text-white shadow-[0_20px_60px_rgba(15,23,42,0.25)] dark:border-slate-800">
					<p className="text-sm uppercase tracking-[0.3em] text-slate-300">Built for teams</p>
					<h2 className="mt-3 text-2xl font-semibold">Admin, teacher, and student experiences in one app.</h2>
					<p className="mt-3 text-sm leading-7 text-slate-300">
						Use the catalog, question bank, and test builder screens to manage exam content without switching systems.
					</p>
				</div>

				<div id="features" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
					{features.map((feature) => (
						<div
							className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900"
							key={feature}
						>
							{feature}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
