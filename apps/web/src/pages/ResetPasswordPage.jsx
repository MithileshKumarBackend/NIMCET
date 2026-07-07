import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { api, getApiErrorMessage } from '../lib/api';

const schema = z.object({
  token: z.string().min(32),
  password: z.string().min(8),
});

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { token: searchParams.get('token') || '' },
  });

  async function onSubmit(values) {
    try {
      const { data } = await api.post('/auth/reset-password', values);
      setNotice(data.message);
      navigate('/login');
    } catch (error) {
      setError('root', { message: getApiErrorMessage(error, 'Unable to reset password') });
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="mb-2 text-2xl font-bold">Reset password</h1>
        <p className="mb-6 text-sm text-slate-500">Paste the reset token from your email and choose a new password.</p>

        {notice && <p className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">{notice}</p>}
        {errors.root && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{errors.root.message}</p>}

        <label className="block text-sm">
          Token
          <input className="mt-1 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-950" {...register('token')} />
        </label>
        {errors.token && <p className="text-sm text-red-500">{errors.token.message}</p>}

        <label className="mt-4 block text-sm">
          New password
          <input type="password" className="mt-1 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-950" {...register('password')} />
        </label>
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

        <button disabled={isSubmitting} className="mt-6 w-full rounded-xl bg-brand-600 p-3 font-medium text-white" type="submit">
          Reset password
        </button>

        <p className="mt-4 text-sm text-slate-500">
          Back to <Link to="/login" className="text-brand-600">login</Link>
        </p>
      </form>
    </div>
  );
}