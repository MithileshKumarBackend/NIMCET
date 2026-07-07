import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { api, getApiErrorMessage } from '../lib/api';
import { setSession } from '../store/authSlice';

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export function LoginPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [googleIdToken, setGoogleIdToken] = useState('');
	const [googleMessage, setGoogleMessage] = useState('');
	const [googleError, setGoogleError] = useState('');
	const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
	} = useForm({ resolver: zodResolver(schema) });

	async function onSubmit(values) {
		try {
			const { data } = await api.post('/auth/login', values);
			dispatch(setSession(data.data));
			navigate('/dashboard');
		} catch (error) {
			setError('root', { message: getApiErrorMessage(error, 'Unable to sign in') });
		}
	}

	async function handleGoogleLogin(event) {
		event.preventDefault();
		setGoogleError('');
		setGoogleMessage('');

		if (!googleIdToken.trim()) {
			setGoogleError('Paste a Google ID token first.');
			return;
		}

		setIsGoogleSigningIn(true);

		try {
			const { data } = await api.post('/auth/google', { idToken: googleIdToken.trim() });
			dispatch(setSession(data.data));
			navigate('/dashboard');
		} catch (error) {
			setGoogleError(getApiErrorMessage(error, 'Google login failed'));
		} finally {
			setIsGoogleSigningIn(false);
		}
	}

	return (
		<div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
			<div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.25)] dark:border-slate-800">
				<p className="text-sm uppercase tracking-[0.3em] text-slate-300">Welcome back</p>
				<h1 className="mt-4 text-4xl font-black tracking-tight">Sign in to your exam workspace.</h1>
				<p className="mt-4 text-sm leading-7 text-slate-300">
					Use your account to manage catalogs, build tests, and access the correct role-based dashboard.
				</p>
				<div className="mt-8 grid gap-3">
					{['Session bootstrap on refresh', 'JWT protected API access', 'Admin, teacher, and student routing'].map((item) => (
						<div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
							{item}
						</div>
					))}
				</div>
			</div>

			<div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85">
				<form onSubmit={handleSubmit(onSubmit)}>
					<h2 className="text-2xl font-bold">Login</h2>
					<p className="mt-2 text-sm text-slate-500">Use your account credentials to continue.</p>

					{errors.root && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{errors.root.message}</p>}

					<div className="mt-6 grid gap-4">
						<label className="block text-sm">
							Email
							<input className="mt-1 w-full rounded-2xl border border-slate-300 bg-white p-3 shadow-sm outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10 dark:border-slate-700 dark:bg-slate-950" {...register('email')} />
						</label>
						{errors.email && <p className="-mt-2 text-sm text-red-500">{errors.email.message}</p>}

						<label className="block text-sm">
							Password
							<input type="password" className="mt-1 w-full rounded-2xl border border-slate-300 bg-white p-3 shadow-sm outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10 dark:border-slate-700 dark:bg-slate-950" {...register('password')} />
						</label>
						{errors.password && <p className="-mt-2 text-sm text-red-500">{errors.password.message}</p>}
					</div>

					<button disabled={isSubmitting} className="mt-6 w-full rounded-2xl bg-brand-600 p-3.5 font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 disabled:opacity-60" type="submit">
						Sign in
					</button>

					<div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-500">
						<Link to="/forgot-password" className="hover:text-slate-900 dark:hover:text-white">
							Forgot password?
						</Link>
						<Link to="/register" className="hover:text-slate-900 dark:hover:text-white">
							Create account
						</Link>
					</div>
				</form>

				<div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm dark:border-slate-700 dark:bg-slate-950/60">
					<p className="font-semibold">Google login</p>
					<p className="mt-1 text-slate-500">Paste a Google ID token to exercise /auth/google.</p>
					<div className="mt-4 space-y-3">
						<textarea
							className="min-h-28 w-full rounded-2xl border border-slate-300 bg-white p-3 text-sm shadow-sm outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10 dark:border-slate-700 dark:bg-slate-950"
							onChange={(event) => setGoogleIdToken(event.target.value)}
							placeholder="Google ID token"
							value={googleIdToken}
						/>
						<button disabled={isGoogleSigningIn} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" onClick={handleGoogleLogin} type="button">
							{isGoogleSigningIn ? 'Signing in...' : 'Google sign in'}
						</button>
						{googleMessage && <p className="text-sm text-emerald-600">{googleMessage}</p>}
						{googleError && <p className="text-sm text-red-600">{googleError}</p>}
					</div>
				</div>
			</div>
		</div>
	);
}
