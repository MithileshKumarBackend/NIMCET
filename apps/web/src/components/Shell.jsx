import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { clearSession } from '../store/authSlice';

export function Shell() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { status, user } = useSelector((state) => state.auth);
	const [isSigningOut, setIsSigningOut] = useState(false);
	const roleHome = user?.role === 'admin' ? '/admin' : user?.role === 'teacher' ? '/teacher' : '/student';
	const isAuthenticated = status === 'authenticated';
	const navItems = isAuthenticated
		? [
			{ to: '/dashboard', label: 'Dashboard' },
			...(user?.role === 'admin' || user?.role === 'teacher'
				? [
					{ to: '/manage/catalog', label: 'Catalog' },
					{ to: '/manage/questions', label: 'Questions' },
					{ to: '/manage/tests', label: 'Tests' },
				]
				: []),
		]
		: [
			{ to: '/login', label: 'Login' },
			{ to: '/register', label: 'Register' },
		];

	async function handleLogout() {
		setIsSigningOut(true);

		try {
			await api.post('/auth/logout');
		} finally {
			dispatch(clearSession());
			setIsSigningOut(false);
			navigate('/');
		}
	}

	return (
		<div className="min-h-screen">
			<header className="sticky top-0 z-20 border-b border-white/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
				<nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
					<div className="flex items-center gap-3">
						<Link
							to="/"
							className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-sm font-black text-white shadow-lg shadow-brand-600/30"
						>
							N
						</Link>
						<div>
							<Link to="/" className="block text-lg font-semibold tracking-tight">
								NIMCET Exams
							</Link>
							<p className="text-xs text-slate-500 dark:text-slate-400">Role-based online exam platform</p>
						</div>
					</div>

					<div className="hidden items-center gap-2 md:flex">
						{navItems.map((item) => (
							<NavLink
								key={item.to}
								to={item.to}
								className={({ isActive }) =>
									`rounded-full px-4 py-2 text-sm transition ${isActive ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'}`
								}
							>
								{item.label}
							</NavLink>
						))}
					</div>

					<div className="flex items-center gap-3">
						{isAuthenticated ? (
							<>
								<div className="hidden rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 sm:block">
									{user?.role?.toUpperCase()} · {user?.name || user?.email || 'signed in'}
								</div>
								<button
									disabled={isSigningOut}
									onClick={handleLogout}
									className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-slate-950/10 transition hover:-translate-y-0.5 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-950"
									type="button"
								>
									{user?.name ? `Logout ${user.name}` : 'Logout'}
								</button>
							</>
						) : (
							<>
								<Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900">
									Login
								</Link>
								<Link to={roleHome} className="rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-brand-600/20 transition hover:-translate-y-0.5">
									Dashboard
								</Link>
							</>
						)}
					</div>
				</nav>
			</header>

			<main>
				<Outlet />
			</main>
		</div>
	);
}
