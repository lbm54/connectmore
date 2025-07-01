"use client";

import React from 'react';
import type { Category } from '@/features/organizers/models/categories_tags';

interface CategoryChipsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryChips({ categories, activeCategory, onCategoryChange }: CategoryChipsProps) {
  return (
    <div className="md:hidden space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-3 py-2 text-xs font-medium rounded-full transition-all duration-200 ${
            activeCategory === 'all'
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
              : 'bg-surface-800 text-surface-300 hover:bg-surface-700 border border-surface-700'
          }`}
        >
          All Events
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id.toString())}
            className={`px-3 py-2 text-xs font-medium rounded-full transition-all duration-200 ${
              activeCategory === category.id.toString()
                ? 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-lg'
                : 'bg-surface-800 text-surface-300 hover:bg-surface-700 border border-surface-700'
            }`}
          >
            {category.category_name}
          </button>
        ))}
      </div>
    </div>
  );
}