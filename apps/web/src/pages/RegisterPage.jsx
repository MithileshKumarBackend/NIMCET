import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { api, getApiErrorMessage } from '../lib/api';
import { setSession } from '../store/authSlice';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be strong and at least 8 characters')
    .regex(/[a-z]/, 'Password must include a lowercase letter')
    .regex(/[A-Z]/, 'Password must include an uppercase letter')
    .regex(/[0-9]/, 'Password must include a number')
    .regex(/[^A-Za-z0-9]/, 'Password must include a symbol'),
});

export function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    try {
      const { data } = await api.post('/auth/register', values);
      dispatch(setSession(data.data));
      navigate('/dashboard');
    } catch (error) {
      setError('root', { message: getApiErrorMessage(error, 'Unable to create account') });
    }
  }

  return (
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1fr_0.95fr] lg:py-20">
        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85">
          <h1 className="text-3xl font-black">Create account</h1>
          <p className="mt-2 text-sm text-slate-500">Register as a student account to test the flow.</p>

          {errors.root && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{errors.root.message}</p>}

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <label className="block text-sm">
              Name
              <input className="mt-1 w-full rounded-2xl border border-slate-300 bg-white p-3 shadow-sm outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10 dark:border-slate-700 dark:bg-slate-950" {...register('name')} />
            </label>
            {errors.name && <p className="-mt-2 text-sm text-red-500">{errors.name.message}</p>}

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
            <p className="text-xs text-slate-500">Use at least 8 characters with uppercase, lowercase, number, and symbol.</p>

            <button disabled={isSubmitting} className="mt-2 w-full rounded-2xl bg-brand-600 p-3.5 font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 disabled:opacity-60" type="submit">
              Register
            </button>

            <p className="text-sm text-slate-500">
              Already have an account? <Link to="/login" className="font-medium text-brand-600">Sign in</Link>
            </p>
          </form>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.25)] dark:border-slate-800">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Student onboarding</p>
          <h2 className="mt-4 text-3xl font-black">Register once. Use the same session across the platform.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Registration follows the same authentication contract as login, so the dashboard and role-based routing work immediately after sign up.
          </p>
        </div>
      </div>
  );
}