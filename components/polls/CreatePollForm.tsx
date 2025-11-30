'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';

interface CreatePollFormProps {
  onSubmit: (form: FormData) => Promise<void>;
}

export default function CreatePollForm({ onSubmit }: CreatePollFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);
  const { register, handleSubmit, reset, watch, setValue } = useForm<{
    question: string;
    description: string;
    options: string[];
    category: string;
    image: FileList;
  }>({
    defaultValues: {
      question: '',
      description: '',
      options: ['', ''],
      category: 'general',
    },
  });

  const options = watch('options');
  const question = watch('question');
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('createPollDraft');
      if (raw) {
        const draft = JSON.parse(raw) as { question?: string; description?: string; options?: string[]; category?: string };
        if (typeof draft.question === 'string') setValue('question', draft.question);
        if (typeof draft.description === 'string') setValue('description', draft.description);
        if (Array.isArray(draft.options) && draft.options.length >= 2) setValue('options', draft.options);
        if (typeof draft.category === 'string') setValue('category', draft.category);
      }
    } catch {}
  }, [setValue]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setCategories(data);
          if (data.length && !params.get('category')) {
            setValue('category', data[0].slug);
          }
        }
      } catch {}
    })();
  }, [setValue, params]);

  const addOption = () => {
    setValue('options', [...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setValue('options', newOptions);
  };

  const handleFormSubmit = async (data: { question: string; description: string; options: string[]; category: string; image: FileList }) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const meRes = await fetch('/api/me');
      const me = await meRes.json().catch(() => ({ user: null }));
      if (!me?.user) {
        try {
          const draft = {
            question: data.question,
            description: data.description,
            options: data.options,
            category: data.category,
          };
          localStorage.setItem('createPollDraft', JSON.stringify(draft));
        } catch {}
        const returnTo = '/polls';
        router.replace(`/login?return=${encodeURIComponent(returnTo)}`);
        return;
      }
      const form = new FormData();
      form.append('question', data.question);
      form.append('description', data.description || '');
      form.append('category', data.category);
      form.append('options', JSON.stringify(data.options.filter(option => option.trim() !== '')));
      const file = data.image?.[0];
      if (file) form.append('image', file);
      await onSubmit(form);
      reset();
      try { localStorage.removeItem('createPollDraft'); } catch {}
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
          Question
        </label>
        <input
          type="text"
          id="question"
          {...register('question', { required: 'Question is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your question"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Add more details"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
        <div className="space-y-2">
          {options.map((_, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                {...register(`options.${index}`, { required: 'Option cannot be empty' })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Option ${index + 1}`}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            + Add another option
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          {...register('category', { required: 'Category is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {categories.length > 0 ? (
            categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))
          ) : (
            <>
              <option value="general">General</option>
              <option value="technology">Technology</option>
              <option value="politics">Politics</option>
              <option value="entertainment">Entertainment</option>
              <option value="sports">Sports</option>
              <option value="other">Other</option>
            </>
          )}
        </select>
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          {...register('image')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !question || options.some(opt => !opt.trim())}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isSubmitting || !question || options.some(opt => !opt.trim())
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {isSubmitting ? 'Creating...' : 'Create Poll'}
        </button>
      </div>
    </form>
  );
}
