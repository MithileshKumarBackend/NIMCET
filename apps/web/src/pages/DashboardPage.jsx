import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { api, getApiErrorMessage } from '../lib/api';
import { clearSession } from '../store/authSlice';

export function DashboardPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useSelector((state) => state.auth.user);
	const [uploadMessage, setUploadMessage] = useState('');
	const [uploadError, setUploadError] = useState('');
	const [isUploading, setIsUploading] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const [isSigningOutAll, setIsSigningOutAll] = useState(false);

	async function handleLogoutAll() {
		setIsSigningOutAll(true);

		try {
			await api.post('/auth/logout-all');
		} finally {
			dispatch(clearSession());
			setIsSigningOutAll(false);
			navigate('/');
		}
	}

	async function handleUpload(event) {
		event.preventDefault();
		setUploadError('');
		setUploadMessage('');

		if (!selectedFile) {
			setUploadError('Choose an image first.');
			return;
		}

		const formData = new FormData();
		formData.append('image', selectedFile);
		setIsUploading(true);

		try {
			const { data } = await api.post('/uploads/question-image', formData);
			setUploadMessage(data.message);
		} catch (error) {
			setUploadError(getApiErrorMessage(error, 'Upload failed'));
		} finally {
			setIsUploading(false);
		}
	}

	return (
		<section className="mx-auto max-w-7xl px-4 py-10">
			<div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85">
				<div className="flex flex-wrap items-end justify-between gap-4">
					<div>
						<p className="text-sm uppercase tracking-[0.3em] text-brand-600">Protected area</p>
						<h1 className="mt-2 text-3xl font-black">Dashboard Foundation</h1>
						<p className="mt-2 text-slate-500">Signed in as {user?.name || user?.email || 'user'}.</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<Link to="/verify-email" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
							Verify email
						</Link>
						<button
							disabled={isSigningOutAll}
							onClick={handleLogoutAll}
							className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-slate-100 dark:text-slate-950"
							type="button"
						>
							Logout all devices
						</button>
					</div>
				</div>

				<div className="mt-8 grid gap-4 md:grid-cols-4">
					{[
						{ label: 'Role', value: user?.role || 'unknown' },
						{ label: 'Session', value: 'bootstrap ready' },
						{ label: 'Uploads', value: 'enabled' },
						{ label: 'Access', value: 'protected' },
					].map((item) => (
						<div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950/60">
							<p className="text-sm text-slate-500">{item.label}</p>
							<p className="mt-2 text-2xl font-black capitalize">{item.value}</p>
						</div>
					))}
				</div>

				<div className="mt-8 grid gap-4 lg:grid-cols-2">
					<div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950/60">
						<h2 className="text-lg font-semibold">Question image upload</h2>
						<p className="mt-2 text-sm text-slate-500">This calls /uploads/question-image.</p>

						{user?.role === 'admin' || user?.role === 'teacher' ? (
							<form onSubmit={handleUpload} className="mt-4 space-y-4">
								<input
									accept="image/*"
									className="block w-full rounded-2xl border border-dashed border-slate-300 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-950"
									onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
									type="file"
								/>
								<button
									disabled={isUploading}
									className="rounded-full bg-brand-600 px-4 py-2 text-white disabled:opacity-60"
									type="submit"
								>
									Upload image
								</button>
								{uploadMessage && <p className="text-sm text-emerald-600">{uploadMessage}</p>}
								{uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
							</form>
						) : (
							<p className="mt-4 text-sm text-slate-500">Upload is available for admin and teacher roles only.</p>
						)}
					</div>

					<div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950/60">
						<h2 className="text-lg font-semibold">Account tools</h2>
						<p className="mt-2 text-sm text-slate-500">The session bootstrap uses /auth/refresh and /auth/me automatically.</p>
						<div className="mt-4 flex flex-wrap gap-3 text-sm">
							<Link className="rounded-full border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200" to="/forgot-password">
								Forgot password
							</Link>
							<Link className="rounded-full border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200" to="/reset-password">
								Reset password
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
