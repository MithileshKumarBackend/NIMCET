import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, getApiErrorMessage } from '../lib/api';

async function fetchItems(path) {
  const { data } = await api.get(path, { params: { limit: 100 } });
  return data.data.items;
}

function toOptions(items) {
  return (items || []).map((item) => ({ label: item.name || item.title, value: item._id }));
}

export function TestBuilderPage() {
  const queryClient = useQueryClient();
  const exams = useQuery({ queryKey: ['test-exams'], queryFn: () => fetchItems('/catalog/exams') });
  const subjects = useQuery({ queryKey: ['test-subjects'], queryFn: () => fetchItems('/catalog/subjects') });
  const questions = useQuery({ queryKey: ['test-questions'], queryFn: () => fetchItems('/questions') });
  const tests = useQuery({ queryKey: ['tests'], queryFn: () => fetchItems('/tests') });
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      exam: '',
      subject: '',
      title: '',
      description: '',
      instructions: '',
      sectionsJson: '[]',
      settingsJson: '{\n  "sectionWiseTimer": false,\n  "shuffleQuestions": false,\n  "shuffleOptions": false,\n  "fullscreenMode": false,\n  "autoSave": true,\n  "autoSubmit": true,\n  "passwordProtected": true,\n  "negativeMarking": false,\n  "resultVisibility": "hidden",\n  "analysisVisibility": false,\n  "reviewDurationMinutes": 0\n}',
      accessJson: '{\n  "passwordHash": "",\n  "allowedEmails": [],\n  "maxAttemptsPerEmail": 1\n}',
      status: 'draft',
    },
  });

  const sectionsValue = watch('sectionsJson');
  const selectedQuestionCount = useMemo(() => {
    try {
      const sections = JSON.parse(sectionsValue || '[]');
      return Array.isArray(sections)
        ? sections.reduce((total, section) => total + (Array.isArray(section.questions) ? section.questions.length : 0), 0)
        : 0;
    } catch {
      return 0;
    }
  }, [sectionsValue]);

  function startEdit(test) {
    setEditingId(test._id);
    setErrorMessage('');
    setStatusMessage('');
    setValue('exam', test.exam?._id || test.exam || '');
    setValue('subject', test.subject?._id || test.subject || '');
    setValue('title', test.title || '');
    setValue('description', test.description || '');
    setValue('instructions', test.instructions || '');
    setValue('sectionsJson', JSON.stringify(test.sections || [], null, 2));
    setValue('settingsJson', JSON.stringify(test.settings || {}, null, 2));
    setValue('accessJson', JSON.stringify(test.access || {}, null, 2));
    setValue('status', test.status || 'draft');
  }

  async function submit(values) {
    setErrorMessage('');
    setStatusMessage('');

    try {
      const payload = {
        exam: values.exam,
        subject: values.subject,
        title: values.title,
        description: values.description,
        instructions: values.instructions,
        sections: JSON.parse(values.sectionsJson || '[]'),
        settings: JSON.parse(values.settingsJson || '{}'),
        access: JSON.parse(values.accessJson || '{}'),
        status: values.status,
      };

      if (editingId) {
        await api.patch(`/tests/${editingId}`, payload);
        setStatusMessage('Test updated');
      } else {
        await api.post('/tests', payload);
        setStatusMessage('Test created');
      }

      setEditingId(null);
      reset();
      await queryClient.invalidateQueries({ queryKey: ['tests'] });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to save test'));
    }
  }

  async function remove(test) {
    await api.delete(`/tests/${test._id}`);
    await queryClient.invalidateQueries({ queryKey: ['tests'] });
  }

  async function restore(test) {
    await api.post(`/tests/${test._id}/restore`);
    await queryClient.invalidateQueries({ queryKey: ['tests'] });
  }

  async function clone(test) {
    await api.post(`/tests/${test._id}/clone`);
    await queryClient.invalidateQueries({ queryKey: ['tests'] });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-widest text-brand-600">Phase 3</p>
        <h1 className="text-3xl font-bold">Test Builder</h1>
        <p className="mt-2 text-slate-500">Create exam tests with unlimited sections and question assignments.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <form className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900" onSubmit={handleSubmit(submit)}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold">{editingId ? 'Edit Test' : 'Create Test'}</h2>
              <p className="text-sm text-slate-500">Selected question count: {selectedQuestionCount}</p>
            </div>
            {editingId && (
              <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-700" onClick={() => setEditingId(null)} type="button">
                Cancel
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium">Exam</span>
              <select className="mt-1 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-950" {...register('exam', { required: true })}>
                <option value="">Select exam</option>
                {toOptions(exams.data).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>

            <label className="block text-sm">
              <span className="font-medium">Subject</span>
              <select className="mt-1 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-950" {...register('subject', { required: true })}>
                <option value="">Select subject</option>
                {toOptions(subjects.data).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>

            <label className="block text-sm md:col-span-2">
              <span className="font-medium">Title</span>
              <input className="mt-1 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-950" {...register('title', { required: true })} />
            </label>

            <label className="block text-sm md:col-span-2">
              <span className="font-medium">Description</span>
              <textarea className="mt-1 min-h-24 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-950" {...register('description')} />
            </label>

            <label className="block text-sm md:col-span-2">
              <span className="font-medium">Instructions</span>
              <textarea className="mt-1 min-h-24 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-950" {...register('instructions')} />
            </label>

            <label className="block text-sm md:col-span-2">
              <span className="font-medium">Sections JSON</span>
              <textarea className="mt-1 min-h-40 w-full rounded-xl border p-3 font-mono text-sm dark:border-slate-700 dark:bg-slate-950" {...register('sectionsJson')} />
            </label>

            <label className="block text-sm md:col-span-2">
              <span className="font-medium">Settings JSON</span>
              <textarea className="mt-1 min-h-40 w-full rounded-xl border p-3 font-mono text-sm dark:border-slate-700 dark:bg-slate-950" {...register('settingsJson')} />
            </label>

            <label className="block text-sm md:col-span-2">
              <span className="font-medium">Access JSON</span>
              <textarea className="mt-1 min-h-32 w-full rounded-xl border p-3 font-mono text-sm dark:border-slate-700 dark:bg-slate-950" {...register('accessJson')} />
            </label>

            <label className="block text-sm">
              <span className="font-medium">Status</span>
              <select className="mt-1 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-950" {...register('status')}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </label>
          </div>

          {errorMessage && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{errorMessage}</p>}
          {statusMessage && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">{statusMessage}</p>}

          <button className="mt-5 rounded-xl bg-brand-600 px-5 py-3 text-sm font-medium text-white" disabled={isSubmitting} type="submit">
            {editingId ? 'Update Test' : 'Create Test'}
          </button>
        </form>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-4 py-3 text-sm font-medium dark:border-slate-800">Existing tests</div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {(tests.data || []).length ? tests.data.map((test) => (
              <div className="p-4" key={test._id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{test.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{test.exam?.name || test.exam} · {test.subject?.name || test.subject}</p>
                    <p className="mt-1 text-xs text-slate-500">Sections: {Array.isArray(test.sections) ? test.sections.length : 0} · Questions: {Array.isArray(test.sections) ? test.sections.reduce((count, section) => count + (section.questions?.length || 0), 0) : 0}</p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2 text-xs">
                    <button className="rounded-full border px-3 py-1" onClick={() => startEdit(test)} type="button">Edit</button>
                    <button className="rounded-full border px-3 py-1" onClick={() => clone(test)} type="button">Clone</button>
                    {test.deletedAt ? (
                      <button className="rounded-full border px-3 py-1" onClick={() => restore(test)} type="button">Restore</button>
                    ) : (
                      <button className="rounded-full border border-red-300 px-3 py-1 text-red-600" onClick={() => remove(test)} type="button">Delete</button>
                    )}
                  </div>
                </div>
              </div>
            )) : <div className="p-6 text-sm text-slate-500">No tests found.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}