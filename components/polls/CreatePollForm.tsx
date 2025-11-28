'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface CreatePollFormProps {
  onSubmit: (data: { question: string; options: string[]; category: string }) => Promise<void>;
}

export default function CreatePollForm({ onSubmit }: CreatePollFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, watch, setValue } = useForm<{
    question: string;
    options: string[];
    category: string;
  }>({
    defaultValues: {
      question: '',
      options: ['', ''],
      category: 'general',
    },
  });

  const options = watch('options');
  const question = watch('question');

  const addOption = () => {
    setValue('options', [...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setValue('options', newOptions);
  };

  const handleFormSubmit = async (data: { question: string; options: string[]; category: string }) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit({
        ...data,
        options: data.options.filter(option => option.trim() !== ''),
      });
      reset();
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
          <option value="general">General</option>
          <option value="technology">Technology</option>
          <option value="politics">Politics</option>
          <option value="entertainment">Entertainment</option>
          <option value="sports">Sports</option>
          <option value="other">Other</option>
        </select>
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
