import { useQuery } from '@tanstack/react-query';
import { CrudManager } from '../components/CrudManager';
import { api } from '../lib/api';

async function fetchItems(path) {
  const { data } = await api.get(path, { params: { limit: 100 } });
  return data.data.items;
}

export function CatalogManagementPage() {
  const exams = useQuery({ queryKey: ['exams-options'], queryFn: () => fetchItems('/catalog/exams') });
  const subjects = useQuery({ queryKey: ['subjects-options'], queryFn: () => fetchItems('/catalog/subjects') });
  const topics = useQuery({ queryKey: ['topics-options'], queryFn: () => fetchItems('/catalog/topics') });

  const examOptions = (exams.data || []).map((item) => ({ label: item.name, value: item._id }));
  const subjectOptions = (subjects.data || []).map((item) => ({ label: item.name, value: item._id }));
  const topicOptions = (topics.data || []).map((item) => ({ label: item.name, value: item._id }));

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10">
      <div>
        <p className="text-sm uppercase tracking-widest text-brand-600">Phase 2</p>
        <h1 className="text-3xl font-bold">Question Bank Catalog</h1>
        <p className="mt-2 text-slate-500">Manage exams, subjects, topics, and subtopics with soft delete, restore, clone, and search.</p>
      </div>

      <CrudManager
        buildPayload={(values) => ({ name: values.name, description: values.description, isActive: values.isActive !== false })}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'slug', label: 'Slug' },
          { key: 'isActive', label: 'Active', render: (item) => (item.isActive ? 'Yes' : 'No') },
        ]}
        description="Top-level exam definitions."
        emptyValues={{ name: '', description: '', isActive: true }}
        fields={[
          { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'JEE Main' },
          { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Exam description' },
          { name: 'isActive', label: 'Active', type: 'checkbox', helperText: 'Visible in the catalog' },
        ]}
        queryKey="catalog-exams"
        resourcePath="/catalog/exams"
        title="Exams"
      />

      <CrudManager
        buildPayload={(values) => ({
          name: values.name,
          description: values.description,
          exam: values.exam,
          isActive: values.isActive !== false,
        })}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'exam', label: 'Exam', render: (item) => item.exam?.name || item.exam },
          { key: 'slug', label: 'Slug' },
        ]}
        description="Subjects belong to an exam."
        emptyValues={{ name: '', description: '', exam: '', isActive: true }}
        fields={[
          { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Physics' },
          { name: 'exam', label: 'Exam', type: 'select', options: examOptions, required: true },
          { name: 'description', label: 'Description', type: 'textarea' },
          { name: 'isActive', label: 'Active', type: 'checkbox' },
        ]}
        queryKey="catalog-subjects"
        resourcePath="/catalog/subjects"
        title="Subjects"
      />

      <CrudManager
        buildPayload={(values) => ({
          name: values.name,
          description: values.description,
          subject: values.subject,
          isActive: values.isActive !== false,
        })}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'subject', label: 'Subject', render: (item) => item.subject?.name || item.subject },
          { key: 'slug', label: 'Slug' },
        ]}
        description="Topics belong to a subject."
        emptyValues={{ name: '', description: '', subject: '', isActive: true }}
        fields={[
          { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Kinematics' },
          { name: 'subject', label: 'Subject', type: 'select', options: subjectOptions, required: true },
          { name: 'description', label: 'Description', type: 'textarea' },
          { name: 'isActive', label: 'Active', type: 'checkbox' },
        ]}
        queryKey="catalog-topics"
        resourcePath="/catalog/topics"
        title="Topics"
      />

      <CrudManager
        buildPayload={(values) => ({
          name: values.name,
          description: values.description,
          topic: values.topic,
          isActive: values.isActive !== false,
        })}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'topic', label: 'Topic', render: (item) => item.topic?.name || item.topic },
          { key: 'slug', label: 'Slug' },
        ]}
        description="Subtopics belong to a topic."
        emptyValues={{ name: '', description: '', topic: '', isActive: true }}
        fields={[
          { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Projectile motion' },
          { name: 'topic', label: 'Topic', type: 'select', options: topicOptions, required: true },
          { name: 'description', label: 'Description', type: 'textarea' },
          { name: 'isActive', label: 'Active', type: 'checkbox' },
        ]}
        queryKey="catalog-subtopics"
        resourcePath="/catalog/subtopics"
        title="Subtopics"
      />
    </div>
  );
}