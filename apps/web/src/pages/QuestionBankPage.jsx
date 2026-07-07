import { useQuery } from '@tanstack/react-query';
import { CrudManager } from '../components/CrudManager';
import { api } from '../lib/api';

async function fetchItems(path) {
  const { data } = await api.get(path, { params: { limit: 100 } });
  return data.data.items;
}

export function QuestionBankPage() {
  const exams = useQuery({ queryKey: ['question-exams'], queryFn: () => fetchItems('/catalog/exams') });
  const subjects = useQuery({ queryKey: ['question-subjects'], queryFn: () => fetchItems('/catalog/subjects') });
  const topics = useQuery({ queryKey: ['question-topics'], queryFn: () => fetchItems('/catalog/topics') });
  const subTopics = useQuery({ queryKey: ['question-subtopics'], queryFn: () => fetchItems('/catalog/subtopics') });

  const optionsFrom = (items) => (items || []).map((item) => ({ label: item.name, value: item._id }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-widest text-brand-600">Phase 2</p>
        <h1 className="text-3xl font-bold">Question Bank</h1>
        <p className="mt-2 text-slate-500">Create, edit, clone, search, filter, and soft delete reusable questions.</p>
      </div>

      <CrudManager
        buildPayload={(values) => ({
          type: values.type,
          exam: values.exam,
          subject: values.subject,
          topic: values.topic,
          subTopic: values.subTopic,
          difficulty: values.difficulty,
          language: values.language,
          prompt: values.prompt,
          explanation: values.explanation,
          solution: values.solution,
          status: values.status,
          tags: values.tags,
          hints: values.hints,
          options: values.options,
        })}
        columns={[
          { key: 'type', label: 'Type' },
          { key: 'difficulty', label: 'Difficulty' },
          { key: 'language', label: 'Language' },
          { key: 'prompt', label: 'Prompt' },
        ]}
        description="Supports MCQ, multi-select, true/false, integer, fill blank, and paragraph questions."
        emptyValues={{
          type: 'single_correct_mcq',
          exam: '',
          subject: '',
          topic: '',
          subTopic: '',
          difficulty: 'medium',
          language: 'en',
          prompt: '',
          explanation: '',
          solution: '',
          status: 'draft',
          tags: '',
          hints: '',
          options: '[]',
        }}
        fields={[
          { name: 'type', label: 'Type', type: 'select', required: true, options: [
            { label: 'Single Correct MCQ', value: 'single_correct_mcq' },
            { label: 'Multiple Correct MCQ', value: 'multiple_correct_mcq' },
            { label: 'True / False', value: 'true_false' },
            { label: 'Integer', value: 'integer' },
            { label: 'Fill in the Blank', value: 'fill_blank' },
            { label: 'Paragraph Based', value: 'paragraph' },
          ] },
          { name: 'exam', label: 'Exam', type: 'select', options: optionsFrom(exams.data), required: true },
          { name: 'subject', label: 'Subject', type: 'select', options: optionsFrom(subjects.data), required: true },
          { name: 'topic', label: 'Topic', type: 'select', options: optionsFrom(topics.data), required: true },
          { name: 'subTopic', label: 'SubTopic', type: 'select', options: optionsFrom(subTopics.data), required: true },
          { name: 'difficulty', label: 'Difficulty', type: 'select', options: [
            { label: 'Easy', value: 'easy' },
            { label: 'Medium', value: 'medium' },
            { label: 'Hard', value: 'hard' },
          ] },
          { name: 'language', label: 'Language', type: 'text', placeholder: 'en' },
          { name: 'prompt', label: 'Prompt', type: 'textarea', required: true },
          { name: 'options', label: 'Options JSON', type: 'json', helpText: 'For MCQ questions, provide an array of option objects.' },
          { name: 'explanation', label: 'Explanation', type: 'textarea' },
          { name: 'solution', label: 'Solution', type: 'textarea' },
          { name: 'tags', label: 'Tags', type: 'tags', helpText: 'Comma-separated tags' },
          { name: 'hints', label: 'Hints JSON', type: 'json', helpText: 'Optional array of hints' },
          { name: 'status', label: 'Status', type: 'select', options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
            { label: 'Archived', value: 'archived' },
          ] },
        ]}
        queryKey="question-bank"
        resourcePath="/questions"
        title="Question"
      />
    </div>
  );
}