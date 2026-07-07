import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, getApiErrorMessage } from '../lib/api';

function normalizeValueForForm(field, value) {
  if (field.type === 'json') {
    return value ? JSON.stringify(value, null, 2) : '';
  }

  if (field.type === 'tags') {
    return Array.isArray(value) ? value.join(', ') : '';
  }

  if (field.type === 'checkbox') {
    return Boolean(value);
  }

  return value ?? '';
}

function parseFieldValue(field, value) {
  if (field.type === 'number') {
    return value === '' || value === null ? undefined : Number(value);
  }

  if (field.type === 'checkbox') {
    return Boolean(value);
  }

  if (field.type === 'json') {
    if (!value?.trim()) {
      return undefined;
    }

    return JSON.parse(value);
  }

  if (field.type === 'tags') {
    return String(value || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return value;
}

function FieldInput({ field, register, errors, watchValue }) {
  const baseClass = 'mt-1 w-full rounded-xl border p-3 text-sm dark:border-slate-700 dark:bg-slate-950';

  if (field.type === 'textarea' || field.type === 'json') {
    return (
      <textarea
        className={`${baseClass} min-h-28`}
        placeholder={field.placeholder}
        {...register(field.name, { required: field.required })}
      />
    );
  }

  if (field.type === 'select') {
    return (
      <select className={baseClass} {...register(field.name, { required: field.required })}>
        <option value="">Select {field.label}</option>
        {field.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <label className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <input className="h-4 w-4 rounded border-slate-300" type="checkbox" {...register(field.name)} />
        {field.helperText || field.label}
      </label>
    );
  }

  return (
    <input
      className={baseClass}
      placeholder={field.placeholder}
      type={field.type === 'number' ? 'number' : 'text'}
      {...register(field.name, { required: field.required })}
    />
  );
}

export function CrudManager({
  title,
  description,
  resourcePath,
  queryKey,
  fields,
  columns,
  emptyValues,
  buildPayload,
  includeDeleted = false,
}) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({ defaultValues: emptyValues });

  const listQuery = useQuery({
    queryKey: [queryKey, search, includeDeleted],
    queryFn: async () => {
      const { data } = await api.get(resourcePath, {
        params: {
          search: search || undefined,
          deleted: includeDeleted ? 'true' : undefined,
        },
      });

      return data.data.items;
    },
  });

  useEffect(() => {
    reset(editingItem ? fields.reduce((accumulator, field) => {
      accumulator[field.name] = normalizeValueForForm(field, editingItem[field.name]);
      return accumulator;
    }, {}) : emptyValues);
  }, [editingItem, emptyValues, fields, reset]);

  async function onSubmit(values) {
    setErrorMessage('');
    setStatusMessage('');

    try {
      const payload = buildPayload ? buildPayload(values, editingItem) : values;

      if (editingItem?._id) {
        await api.patch(`${resourcePath}/${editingItem._id}`, payload);
        setStatusMessage(`${title} updated`);
      } else {
        await api.post(resourcePath, payload);
        setStatusMessage(`${title} created`);
      }

      setEditingItem(null);
      reset(emptyValues);
      await queryClient.invalidateQueries({ queryKey: [queryKey] });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, `Unable to save ${title.toLowerCase()}`));
    }
  }

  async function handleDelete(item) {
    await api.delete(`${resourcePath}/${item._id}`);
    await queryClient.invalidateQueries({ queryKey: [queryKey] });
  }

  async function handleRestore(item) {
    await api.post(`${resourcePath}/${item._id}/restore`);
    await queryClient.invalidateQueries({ queryKey: [queryKey] });
  }

  async function handleClone(item) {
    await api.post(`${resourcePath}/${item._id}/clone`);
    await queryClient.invalidateQueries({ queryKey: [queryKey] });
  }

  function startEdit(item) {
    setEditingItem(item);
    setErrorMessage('');
    setStatusMessage('');
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        <div className="w-full max-w-sm">
          <input
            className="w-full rounded-xl border px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
            value={search}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">{editingItem ? `Edit ${title}` : `Create ${title}`}</h3>
              <p className="text-xs text-slate-500">{editingItem ? 'Update the existing record' : 'Create a new record'}</p>
            </div>
            {editingItem && (
              <button
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-700"
                onClick={() => setEditingItem(null)}
                type="button"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="grid gap-4">
            {fields.map((field) => (
              <label className="block text-sm" key={field.name}>
                <span className="font-medium">{field.label}</span>
                <FieldInput errors={errors} field={field} register={register} watchValue={watch(field.name)} />
                {field.helpText && <p className="mt-1 text-xs text-slate-500">{field.helpText}</p>}
              </label>
            ))}
          </div>

          {errorMessage && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{errorMessage}</p>}
          {statusMessage && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">{statusMessage}</p>}

          <button className="mt-5 rounded-xl bg-brand-600 px-5 py-3 text-sm font-medium text-white" disabled={isSubmitting} type="submit">
            {editingItem ? 'Update' : 'Create'}
          </button>
        </form>

        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="border-b border-slate-200 px-4 py-3 text-sm font-medium dark:border-slate-800">Records</div>
          <div className="max-h-[760px] divide-y divide-slate-200 overflow-auto dark:divide-slate-800">
            {listQuery.isLoading ? (
              <div className="p-6 text-sm text-slate-500">Loading...</div>
            ) : listQuery.data?.length ? (
              listQuery.data.map((item) => (
                <div className="p-4" key={item._id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{columns[0]?.render ? columns[0].render(item) : item[columns[0]?.key]}</p>
                      <div className="mt-2 grid gap-1 text-xs text-slate-500">
                        {columns.slice(1).map((column) => (
                          <p key={column.key}>
                            <span className="font-medium text-slate-600 dark:text-slate-300">{column.label}:</span>{' '}
                            {column.render ? column.render(item) : String(item[column.key] ?? '—')}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2 text-xs">
                      <button className="rounded-full border px-3 py-1" onClick={() => startEdit(item)} type="button">
                        Edit
                      </button>
                      <button className="rounded-full border px-3 py-1" onClick={() => handleClone(item)} type="button">
                        Clone
                      </button>
                      {item.deletedAt ? (
                        <button className="rounded-full border px-3 py-1" onClick={() => handleRestore(item)} type="button">
                          Restore
                        </button>
                      ) : (
                        <button className="rounded-full border border-red-300 px-3 py-1 text-red-600" onClick={() => handleDelete(item)} type="button">
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-sm text-slate-500">No records found.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}